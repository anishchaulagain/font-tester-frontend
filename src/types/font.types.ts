export interface Font {
  id: number;
  name: string;
  category: string;
  subsets: string[];
  google_fonts_url: string;
  createdAt: string;
}

export interface FilterOptions {
  query: string;
  language: string;
  category: string;
  sortBy: 'name' | 'recent' | 'trending';
}

export interface PreviewSettings {
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
}