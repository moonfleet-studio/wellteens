/**
 * @deprecated Use Article type from '@/lib/api/articles' instead
 * This file is kept for backward compatibility with mock data
 */
export type ArticleContent = {
  id: string;
  title: string;
  description: string;
  categoryLabel: string;
  image: string;
  content: string[];
};

/**
 * @deprecated Mock data - replaced by API integration
 * Use fetchArticles() from '@/lib/api/articles' instead
 */
export const ARTICLE_LIBRARY: ArticleContent[] = [
  {
    id: 'article-01',
    title: 'Mindful Morning Routines',
    description: 'Easy, 5-minute morning practices to help you wake up calmly and check in with your feelings before the day starts. Includes gentle stretches, short breathing cues, and simple reflection prompts.',
    categoryLabel: 'ARTICLE',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    content: [
      'Start your day with one minute of stillness. Sit tall, close your eyes, and notice three sounds around you. This tiny pause helps your brain shift out of sleep mode and into a calmer state before messages and tasks rush in.',
      'Once you stand up, roll your shoulders back and stretch your arms overhead. Pair the movement with a long inhale through your nose and a slow exhale through your mouth. Visualize the stretch creating more space for whatever the day brings.',
      'Before you leave your room, ask yourself one gentle question like “What do I need today?” or “Which friend can I lean on if things feel heavy?” Writing your answer in a few words builds a habit of checking in rather than pushing feelings aside.',
    ],
  },
  {
    id: 'article-02',
    title: 'Journaling Prompts for Teens',
    description: 'A set of quick journaling prompts to help teenagers notice emotions, reduce rumination, and find one small next step when things feel heavy.',
    categoryLabel: 'ARTICLE',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
    content: [
      'Journaling does not need to be perfect prose. Start with “Right now I feel…” and finish the sentence without judging what comes out. Naming feelings reduces their intensity and gives you clues about what support you need.',
      'On tough days, try the “three moments” exercise: note one thing that made you smile, one thing that felt hard, and one thing you can do to care for yourself tonight. It keeps your brain from focusing only on the difficult bits.',
      'If you are stuck, imagine texting a friend who understands you. Write that message in your journal. Explaining your day to someone else often reveals the lesson you were meant to learn.',
    ],
  },
  {
    id: 'article-03',
    title: 'Breathing Exercises That Work',
    description: 'Practical breathing techniques and short exercises to reduce anxiety and bring attention back to the present, useful in classrooms, at home, or before sleep.',
    categoryLabel: 'ARTICLE',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    content: [
      'Box breathing is a simple rhythm you can practice anywhere. Inhale for four counts, hold for four, exhale for four, and pause for four. Repeat the square three times and notice how your shoulders soften each round.',
      'For restless energy, try “smell the flower, blow out the candle.” Breathe in gently through your nose as if smelling a flower, then exhale through pursed lips like you are blowing out a candle. The playful visual keeps the exercise from feeling clinical.',
      'If you prefer movement, trace an infinity sign in the air with your finger while breathing slowly. Matching the loop with your inhale and exhale gives your mind a focal point when anxious thoughts spin.',
    ],
  },
];

/**
 * @deprecated Use fetchArticleById() from '@/lib/api/articles' instead
 */
export function getArticleById(id?: string) {
  if (!id) return undefined;
  return ARTICLE_LIBRARY.find((article) => article.id === id);
}
