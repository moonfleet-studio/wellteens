import { apiFetch } from "./client";

export interface Banner {
  id: number;
  name: string;
  description: string;
  value_emitter: number;
  updatedAt: string;
  createdAt: string;
}

export interface BannersResponse {
  docs: Banner[];
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

export async function fetchBanners(
  page: number = 1,
  limit: number = 100,
): Promise<BannersResponse> {
  return apiFetch<BannersResponse>(`/api/banners?page=${page}&limit=${limit}`);
}

/**
 * Find the best-matching banner for the given mood value.
 * Picks the banner whose value_emitter is closest to the current mood.
 * If no banners exist, returns null.
 */
export function getBannerForMood(
  banners: Banner[],
  moodValue: number,
): Banner | null {
  if (banners.length === 0) return null;

  let best = banners[0];
  let bestDist = Math.abs(best.value_emitter - moodValue);

  for (const banner of banners) {
    const dist = Math.abs(banner.value_emitter - moodValue);
    if (dist < bestDist) {
      best = banner;
      bestDist = dist;
    }
  }

  return best;
}
