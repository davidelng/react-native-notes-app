export type Note = {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  pinned: number;
  tag: null | string;
  tagColor: null | string;
  tagId: null | number;
};

export type Tag = {
  id: number;
  name: string;
  color: string;
};

export type AIPrompt = {
  prompt: string;
  temperature: number;
  maxTokens: number;
};
