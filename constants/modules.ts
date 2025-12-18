import type { ChipVariant } from '@/components/ui/chip';

/**
 * @deprecated Use Module type from '@/lib/api/modules' instead
 * This file is kept for backward compatibility with mock data
 */
export type ModuleContent = {
  id: string;
  title: string;
  description: string;
  image: string;
  chipVariant: ChipVariant;
  videoIds: string[];
  articleIds: string[];
};

/**
 * @deprecated Mock data - replaced by API integration
 * Use fetchModules() from '@/lib/api/modules' instead
 */
export const MODULE_LIBRARY: ModuleContent[] = [
  {
    id: 'sleep-reset',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    title: 'Sleep reset',
    description: 'Gentle wind-down prompts that help you switch off before bedtime.',
    chipVariant: 'module',
    videoIds: ['1', '3'],
    articleIds: ['article-01', 'article-03'],
  },
  {
    id: 'confidence-lifts',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    title: 'Confidence lifts',
    description: 'Tiny wins to celebrate when you speak up or try something new.',
    chipVariant: 'module',
    videoIds: ['2', '4'],
    articleIds: ['article-02'],
  },
  {
    id: 'body-scan',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    title: 'Body scan reset',
    description: 'Short guided body awareness practice for when energy dips.',
    chipVariant: 'module',
    videoIds: ['1', '5'],
    articleIds: ['article-03'],
  },
  {
    id: 'friendship-check',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    title: 'Friendship check-in',
    description: 'Map whose energy lifts you and plan one small reach out.',
    chipVariant: 'module',
    videoIds: ['2'],
    articleIds: ['article-02', 'article-01'],
  },
  {
    id: 'focus-breath',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    title: 'Focus breath',
    description: 'Breath cues to reset attention before a tough conversation.',
    chipVariant: 'module',
    videoIds: ['3', '5'],
    articleIds: ['article-03', 'article-01'],
  },
];

/**
 * @deprecated Use fetchModuleById() from '@/lib/api/modules' instead
 */
export function getModuleById(id?: string): ModuleContent | undefined {
  if (!id) return undefined;
  return MODULE_LIBRARY.find((module) => module.id === id);
}
