export interface Song {
  title: string;
  stylePrompt: string;
  lyrics: string;
}

export interface SongGenerationResponse {
  songs: Song[];
}

export interface GeneratorFormData {
  topic: string;
  rhythm: string;
}