import { apiFetch } from './client';

/**
 * Article content structure from Lexical editor
 */
export interface ArticleContentNode {
  type: string;
  format: string;
  indent: number;
  version: number;
  children?: ArticleContentNode[];
  text?: string;
  mode?: string;
  style?: string;
  detail?: number;
  direction?: string | null;
  textStyle?: string;
  textFormat?: number;
}

export interface ArticleContent {
  root: ArticleContentNode;
}

/**
 * Photo/Media object from API
 */
export interface ArticlePhoto {
  id: number;
  alt: string;
  url: string;
  thumbnailURL: string | null;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  updatedAt: string;
  createdAt: string;
}

/**
 * Article from API
 */
export interface Article {
  id: number;
  title: string;
  author: string;
  lead: string;
  photo: ArticlePhoto;
  content: ArticleContent;
  updatedAt: string;
  createdAt: string;
  _status: 'draft' | 'published';
}

/**
 * Articles list response
 */
export interface ArticlesResponse {
  docs: Article[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

/**
 * Fetch all articles
 */
export async function fetchArticles(page: number = 1, limit: number = 10): Promise<ArticlesResponse> {
  return apiFetch<ArticlesResponse>(`/api/articles?page=${page}&limit=${limit}&where[_status][equals]=published`);
}

/**
 * Fetch single article by ID
 */
export async function fetchArticleById(id: number): Promise<Article> {
  return apiFetch<Article>(`/api/articles/${id}`);
}

/**
 * Get article photo URL with base URL
 */
export function getArticlePhotoUrl(article: Article): string {
  const baseUrl = 'https://wellteens.mfleet.io';
  return `${baseUrl}${article.photo.url}`;
}

/**
 * Extract plain text from Lexical content
 */
export function extractTextFromContent(content: ArticleContent): string[] {
  const paragraphs: string[] = [];
  
  function traverse(node: ArticleContentNode) {
    if (node.type === 'paragraph' && node.children) {
      const text = node.children
        .filter((child) => child.type === 'text' && child.text)
        .map((child) => child.text)
        .join('');
      
      if (text.trim()) {
        paragraphs.push(text);
      }
    }
    
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  traverse(content.root);
  return paragraphs;
}
