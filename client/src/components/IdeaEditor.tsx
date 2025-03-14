import { Plus } from "lucide-react";
import { useIdeas } from "@/hooks/useIdeas";
import { Button } from "@/components/ui/button";

const IdeaEditor = () => {
  const { 
    currentIdea, 
    setCurrentIdeaTitle, 
    setCurrentIdeaContent, 
    saveIdea, 
    selectedIdeaId 
  } = useIdeas();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIdeaTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentIdeaContent(e.target.value);
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
      <h2 className="text-xl font-semibold text-neutral mb-4">
        {selectedIdeaId ? "Edit Idea" : "Capture New Idea"}
      </h2>

      <div className="flex flex-col flex-1">
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

        <div className="flex-1 mb-4">
          <label htmlFor="idea-content" className="block text-sm font-medium text-gray-700 mb-1">
            Details
          </label>
          <textarea
            id="idea-content"
            placeholder="Describe your idea here..."
            className="w-full h-full px-4 py-2 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
  );
};

export default IdeaEditor;
