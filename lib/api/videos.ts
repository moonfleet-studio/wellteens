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

/**
 * Get video duration placeholder
 * TODO: Remove when API provides duration field
 */
export function getVideoDuration(video: Video): string {
  // Hardcoded placeholder until API is updated
  return '00:00';
}

/**
 * Get video title placeholder
 * TODO: Remove when API provides title field
 */
export function getVideoTitle(video: Video): string {
  // Use thumbnail alt text as fallback or generic title
  return video.thumbnail?.alt || `Video ${video.id}`;
}

/**
 * Get video description placeholder
 * TODO: Remove when API provides description field
 */
export function getVideoDescription(video: Video): string {
  // Hardcoded placeholder until API is updated
  return 'Watch this video to learn more.';
}
