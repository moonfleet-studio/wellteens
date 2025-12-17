import type { Article } from './articles';
import { apiFetch } from './client';
import type { Video } from './videos';

/**
 * Mood structure from API
 */
export interface Mood {
  id: number;
  name: string;
  value: number;
  updatedAt: string;
  createdAt: string;
}

/**
 * Module from API
 */
export interface Module {
  id: number;
  name: string;
  description: string;
  articles: Article[];
  videos: Video[];
  mood: Mood;
  updatedAt: string;
  createdAt: string;
}

/**
 * Modules list response
 */
export interface ModulesResponse {
  docs: Module[];
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
 * Fetch all modules
 */
export async function fetchModules(page: number = 1, limit: number = 100): Promise<ModulesResponse> {
  return apiFetch<ModulesResponse>(`/api/modules?page=${page}&limit=${limit}`);
}

/**
 * Fetch single module by ID
 */
export async function fetchModuleById(id: number): Promise<Module> {
  return apiFetch<Module>(`/api/modules/${id}`);
}

/**
 * Get module image placeholder
 * TODO: Add image field to API
 */
export function getModuleImage(module: Module): string {
  // Use first video thumbnail or article photo as fallback
  if (module.videos.length > 0 && module.videos[0].thumbnail) {
    return module.videos[0].thumbnail.url;
  }
  if (module.articles.length > 0 && module.articles[0].photo) {
    return module.articles[0].photo;
  }
  return 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80';
}
