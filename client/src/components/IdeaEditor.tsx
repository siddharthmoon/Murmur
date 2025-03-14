import { Plus, Mic, MicOff, PenSquare, Play, Square, StopCircle } from "lucide-react";
import { useIdeas } from "@/hooks/useIdeas";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const IdeaEditor = () => {
  const { 
    currentIdea, 
    setCurrentIdeaTitle, 
    setCurrentIdeaContent, 
    setCurrentIdeaAudio,
    saveIdea, 
    selectedIdeaId,
    isEditorVisible,
    toggleEditor
  } = useIdeas();
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIdeaTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentIdeaContent(e.target.value);
  };
  
  // Format recording time (seconds) to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Set up recording timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      
      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stopped event
      mediaRecorder.onstop = () => {
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Create audio blob and URL
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Create audio URL for playback
        const audioUrl = URL.createObjectURL(audioBlob);
        setCurrentIdeaAudio(audioUrl);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Your voice is being recorded",
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording finished",
        description: `Recorded ${formatTime(recordingTime)} of audio`,
      });
    }
  };
  
  // Play recorded audio
  const playAudio = () => {
    if (currentIdea.audioUrl && !isPlaying) {
      // Create audio element if it doesn't exist
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(currentIdea.audioUrl);
        audioPlayerRef.current.onended = () => setIsPlaying(false);
      } else {
        audioPlayerRef.current.src = currentIdea.audioUrl;
      }
      
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };
  
  // Stop audio playback
  const stopAudio = () => {
    if (audioPlayerRef.current && isPlaying) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  // Delete recorded audio
  const deleteAudio = () => {
    if (currentIdea.audioUrl) {
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(currentIdea.audioUrl);
      
      // Reset audio state
      setCurrentIdeaAudio("");
      setAudioBlob(null);
      setRecordingTime(0);
      
      // Reset audio player
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
      }
      
      setIsPlaying(false);
      
      toast({
        title: "Audio deleted",
        description: "Voice recording has been removed",
      });
    }
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Clear timer if running
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Stop recording if in progress
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      // Clean up audio player
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      
      // Revoke any object URLs to prevent memory leaks
      if (currentIdea.audioUrl) {
        URL.revokeObjectURL(currentIdea.audioUrl);
      }
    };
  }, []);

  // If the editor is not visible and no idea is selected, show only the button
  if (!isEditorVisible && !selectedIdeaId) {
    return (
      <div className="fixed bottom-8 right-8">
        <Button 
          onClick={toggleEditor}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg h-16 w-16"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 p-4">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col max-h-[90vh] border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral">
            {selectedIdeaId ? "Edit Murmur" : "Capture New Murmur"}
          </h2>
          <Button 
            variant="ghost" 
            onClick={toggleEditor}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="mb-4">
            <label htmlFor="idea-title" className="block text-sm font-medium text-foreground mb-1">
              Title
            </label>
            <input
              type="text"
              id="idea-title"
              placeholder="What's your murmur about?"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={currentIdea.title}
              onChange={handleTitleChange}
            />
          </div>

          <div className="flex-1 mb-4 overflow-hidden">
            <label htmlFor="idea-content" className="block text-sm font-medium text-foreground mb-1">
              Details
            </label>
            <textarea
              id="idea-content"
              placeholder="Describe your thoughts here..."
              className="w-full h-40 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={currentIdea.content}
              onChange={handleContentChange}
            />
          </div>
          
          {/* Voice Recording Section */}
          <div className="mb-4 border border-border rounded-lg p-3 bg-background/60">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-foreground mr-2">Voice Notes</h3>
                {currentIdea.hasAudio && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Audio Available
                  </Badge>
                )}
              </div>
              
              {isRecording && (
                <div className="flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                  <span className="text-sm font-medium text-red-500">{formatTime(recordingTime)}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {!isRecording && !currentIdea.audioUrl && (
                <Button 
                  onClick={startRecording} 
                  size="sm" 
                  variant="outline"
                  className="text-red-500 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <Mic className="w-4 h-4 mr-1" />
                  Record Voice
                </Button>
              )}
              
              {isRecording && (
                <Button 
                  onClick={stopRecording} 
                  size="sm" 
                  variant="outline"
                  className="text-red-500 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <StopCircle className="w-4 h-4 mr-1" />
                  Stop Recording
                </Button>
              )}
              
              {currentIdea.audioUrl && !isPlaying && (
                <Button 
                  onClick={playAudio} 
                  size="sm" 
                  variant="outline"
                  className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Play
                </Button>
              )}
              
              {currentIdea.audioUrl && isPlaying && (
                <Button 
                  onClick={stopAudio} 
                  size="sm" 
                  variant="outline"
                  className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              )}
              
              {currentIdea.audioUrl && (
                <Button 
                  onClick={deleteAudio} 
                  size="sm" 
                  variant="outline"
                  className="text-muted-foreground border-border hover:bg-muted/50"
                >
                  Delete Audio
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              <p>Murmurs saved locally on your device</p>
            </div>
            <Button
              onClick={saveIdea}
              className={`${
                selectedIdeaId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary hover:bg-primary/90'
              } text-white`}
            >
              {!selectedIdeaId && <Plus className="w-5 h-5 mr-1" />}
              {selectedIdeaId ? "Update Murmur" : "Save Murmur"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaEditor;
