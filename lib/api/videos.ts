import { API_BASE_URL, apiFetch } from './client';

/**
 * Media/Thumbnail structure from API
 */
export interface Media {
  id: number;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string | null;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
}

/**
 * Video from API
 */
export interface Video {
  id: number;
  link: string;
  title: string;
  description: string;
  thumbnail: Media;
  updatedAt: string;
  createdAt: string;
}

/**
 * Videos list response
 */
export interface VideosResponse {
  docs: Video[];
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
 * Fetch all videos
 */
export async function fetchVideos(page: number = 1, limit: number = 100): Promise<VideosResponse> {
  return apiFetch<VideosResponse>(`/api/videos?page=${page}&limit=${limit}`);
}

/**
 * Fetch single video by ID
 */
export async function fetchVideoById(id: number): Promise<Video> {
  return apiFetch<Video>(`/api/videos/${id}`);
}

/**
 * Get full media URL
 */
export function getMediaUrl(url: string): string {
  if (url.startsWith('http')) {
    return url;
  }
  return `${API_BASE_URL}${url}`;
}
