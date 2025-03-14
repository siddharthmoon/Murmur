import { createContext, useState, useEffect, ReactNode } from "react";
import { Idea, CurrentIdea } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface IdeaContextType {
  ideas: Idea[];
  filteredIdeas: Idea[];
  currentIdea: CurrentIdea;
  selectedIdeaId: number | null;
  deleteIdeaId: number | null;
  isDeleteDialogOpen: boolean;
  isEditorVisible: boolean;
  searchQuery: string;
  isSearching: boolean;
  setCurrentIdeaTitle: (title: string) => void;
  setCurrentIdeaContent: (content: string) => void;
  setSearchQuery: (query: string) => void;
  toggleEditor: () => void;
  saveIdea: () => void;
  selectIdea: (id: number) => void;
  confirmDelete: (id: number) => void;
  deleteIdea: () => void;
  cancelDelete: () => void;
}

export const IdeaContext = createContext<IdeaContextType>({
  ideas: [],
  filteredIdeas: [],
  currentIdea: { title: "", content: "" },
  selectedIdeaId: null,
  deleteIdeaId: null,
  isDeleteDialogOpen: false,
  isEditorVisible: false,
  searchQuery: "",
  isSearching: false,
  setCurrentIdeaTitle: () => {},
  setCurrentIdeaContent: () => {},
  setSearchQuery: () => {},
  toggleEditor: () => {},
  saveIdea: () => {},
  selectIdea: () => {},
  confirmDelete: () => {},
  deleteIdea: () => {},
  cancelDelete: () => {},
});

interface IdeaProviderProps {
  children: ReactNode;
}

export const IdeaProvider = ({ children }: IdeaProviderProps) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentIdea, setCurrentIdea] = useState<CurrentIdea>({ title: "", content: "" });
  const [selectedIdeaId, setSelectedIdeaId] = useState<number | null>(null);
  const [deleteIdeaId, setDeleteIdeaId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Load ideas from localStorage on mount
  useEffect(() => {
    const storedIdeas = localStorage.getItem("ideas");
    if (storedIdeas) {
      try {
        setIdeas(JSON.parse(storedIdeas));
      } catch (error) {
        console.error("Failed to parse ideas from localStorage", error);
        toast({
          title: "Error",
          description: "Failed to load saved ideas",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Save ideas to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }, [ideas]);

  // Filter ideas based on search query
  const filteredIdeas = searchQuery.trim() === ""
    ? [...ideas].sort((a, b) => b.timestamp - a.timestamp)
    : [...ideas]
        .filter(
          (idea) =>
            idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.timestamp - a.timestamp);

  const isSearching = searchQuery.trim() !== "";

  const setCurrentIdeaTitle = (title: string) => {
    setCurrentIdea((prev) => ({ ...prev, title }));
  };

  const setCurrentIdeaContent = (content: string) => {
    setCurrentIdea((prev) => ({ ...prev, content }));
  };

  const saveIdea = () => {
    if (!currentIdea.title.trim()) {
      toast({
        title: "Error",
        description: "Please add a title for your idea",
        variant: "destructive",
      });
      return;
    }

    if (selectedIdeaId) {
      // Update existing idea
      const updatedIdeas = ideas.map((idea) =>
        idea.id === selectedIdeaId
          ? {
              ...idea,
              title: currentIdea.title.trim(),
              content: currentIdea.content.trim(),
            }
          : idea
      );

      setIdeas(updatedIdeas);
      toast({
        title: "Success",
        description: "Idea updated successfully!",
      });
    } else {
      // Create new idea
      const newIdea: Idea = {
        id: Date.now(),
        title: currentIdea.title.trim(),
        content: currentIdea.content.trim(),
        timestamp: Date.now(),
      };

      setIdeas((prev) => [newIdea, ...prev]);
      toast({
        title: "Success",
        description: "Idea saved successfully!",
      });
    }

    // Reset form
    setCurrentIdea({ title: "", content: "" });
    setSelectedIdeaId(null);
  };

  const selectIdea = (id: number) => {
    const idea = ideas.find((idea) => idea.id === id);
    if (idea) {
      setCurrentIdea({
        title: idea.title,
        content: idea.content,
      });
      setSelectedIdeaId(id);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteIdeaId(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteIdea = () => {
    if (deleteIdeaId) {
      setIdeas((prev) => prev.filter((idea) => idea.id !== deleteIdeaId));
      
      // Reset form if the deleted idea was selected
      if (selectedIdeaId === deleteIdeaId) {
        setCurrentIdea({ title: "", content: "" });
        setSelectedIdeaId(null);
      }
      
      toast({
        title: "Success",
        description: "Idea deleted successfully!",
      });
    }
    
    setIsDeleteDialogOpen(false);
    setDeleteIdeaId(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIdeaId(null);
  };
  
  const toggleEditor = () => {
    if (isEditorVisible && selectedIdeaId === null) {
      // If editor is visible and no idea is selected, hide it
      setIsEditorVisible(false);
      setCurrentIdea({ title: "", content: "" });
    } else {
      // Otherwise show it
      setIsEditorVisible(true);
    }
  };

  return (
    <IdeaContext.Provider
      value={{
        ideas,
        filteredIdeas,
        currentIdea,
        selectedIdeaId,
        deleteIdeaId,
        isDeleteDialogOpen,
        isEditorVisible,
        searchQuery,
        isSearching,
        setCurrentIdeaTitle,
        setCurrentIdeaContent,
        setSearchQuery,
        toggleEditor,
        saveIdea,
        selectIdea,
        confirmDelete,
        deleteIdea,
        cancelDelete,
      }}
    >
      {children}
    </IdeaContext.Provider>
  );
};
