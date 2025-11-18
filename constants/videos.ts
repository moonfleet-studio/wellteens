export type VideoContent = {
  id: string;
  title: string;
  duration: string;
  description: string;
  image: string;
  source: string;
};

export const VIDEO_LIBRARY: VideoContent[] = [
  {
    id: '1',
    title: 'Your mood',
    duration: '05:23',
    description: 'Quick practices to pause, breathe, and notice what your body is trying to tell you.',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80',
    source: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerHearts.mp4',
  },
  {
    id: '2',
    title: 'Grounding with friends',
    duration: '04:11',
    description: 'A walk-and-talk script to help your circle open up about how they are really doing.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    source: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '3',
    title: 'Morning reset',
    duration: '03:45',
    description: 'Gentle stretches plus mantras that set a calmer tone before classes begin.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    source: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: '4',
    title: 'Study stretch',
    duration: '06:00',
    description: 'Gentle stretches for your back while preparing for exams.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    source: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  },
  {
    id: '5',
    title: 'Breathing walk',
    duration: '04:30',
    description: 'Mindful breathing routine you can try while walking to school.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    source: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
];

export function getVideoById(id?: string) {
  if (!id) return undefined;
  return VIDEO_LIBRARY.find((video) => video.id === id);
}
