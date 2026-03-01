import { redirect } from 'next/navigation';

// /studio → redirect to /studio/projects
export default function StudioPage() {
  redirect('/studio/projects');
}
