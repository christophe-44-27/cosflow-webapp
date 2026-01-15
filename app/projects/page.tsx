import { Suspense } from 'react';
import { AppLayout } from '../components/app-layout';
import { WebProjectsView } from '../components/web-projects-view';

export default function ProjectsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="text-white">Chargement...</div></div>}>
        <WebProjectsView />
      </Suspense>
    </AppLayout>
  );
}
