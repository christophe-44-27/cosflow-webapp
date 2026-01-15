import { Suspense } from 'react';
import { AppLayout } from '../components/app-layout';
import { WebCreatorsView } from '../components/web-creators-view';

export default function CreatorsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="text-white">Chargement...</div></div>}>
        <WebCreatorsView />
      </Suspense>
    </AppLayout>
  );
}
