export interface ApiKey {
  id: number;
  userId: number;
  service: string; // 'groq', 'openai', etc.
  key: string;
  createdAt: Date;
  updatedAt: Date;
}