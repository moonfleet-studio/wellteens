export type ArticleContent = {
  id: string;
  title: string;
  description: string;
  categoryLabel: string;
  image: string;
};

export const ARTICLE_LIBRARY: ArticleContent[] = [
  {
    id: 'article-01',
    title: 'Mindful Morning Routines',
    description: 'Simple stretches and reflections that help you check in with your feelings before the day begins. Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit. Ipsum qui cupidatat est. Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit.',
    categoryLabel: 'ARTICLE',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'article-02',
    title: 'Journaling Prompts for Teens',
    description: 'Five quick prompts to capture your thoughts when emotions feel overwhelming. Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit. Ipsum qui cupidatat est. Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit.',
    categoryLabel: 'ARTICLE',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'article-03',
    title: 'Breathing Exercises That Work',
    description: 'A step-by-step guide to calm your body during stressful moments in class or at home.',
    categoryLabel: 'ARTICLE',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  },
];
