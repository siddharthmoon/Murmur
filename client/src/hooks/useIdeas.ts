import { useContext } from "react";
import { IdeaContext } from "@/context/IdeaContext";

export const useIdeas = () => {
  const context = useContext(IdeaContext);
  
  if (!context) {
    throw new Error("useIdeas must be used within an IdeaProvider");
  }
  
  return context;
};
