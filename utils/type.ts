export interface IArticle {
  content: string;
  createdAt: Date;
  email: string;
  images: string[];
  dynamicKeywords: string[];
  staticKeywords: string[];
  seasonKeywords: string[];
  weatherKeywords: string[];
}
