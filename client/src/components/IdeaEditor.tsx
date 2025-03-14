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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral">
            {selectedIdeaId ? "Edit Idea" : "Capture New Idea"}
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
            <label htmlFor="idea-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="idea-title"
              placeholder="What's your idea about?"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={currentIdea.title}
              onChange={handleTitleChange}
            />
          </div>

          <div className="flex-1 mb-4 overflow-hidden">
            <label htmlFor="idea-content" className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              id="idea-content"
              placeholder="Describe your idea here..."
              className="w-full h-40 px-4 py-2 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={currentIdea.content}
              onChange={handleContentChange}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              <p>Ideas saved locally on your device</p>
            </div>
            <Button
              onClick={saveIdea}
              className={`${
                selectedIdeaId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary hover:bg-primary/90'
              } text-white`}
            >
              {!selectedIdeaId && <Plus className="w-5 h-5 mr-1" />}
              {selectedIdeaId ? "Update Idea" : "Save Idea"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaEditor;
