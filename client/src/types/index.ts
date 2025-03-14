export interface Idea {
  id: number;
  title: string;
  content: string;
  audioUrl?: string;  // URL for the recorded audio blob
  hasAudio?: boolean; // Flag to indicate if this idea has audio
  timestamp: number;
}

export interface CurrentIdea {
  title: string;
  content: string;
  audioUrl?: string;
  hasAudio?: boolean;
}
