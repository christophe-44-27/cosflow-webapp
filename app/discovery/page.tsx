import { Suspense } from 'react';
import { AppLayout } from '../components/app-layout';
import { DiscoveryView } from '../components/discovery-view';

export default function DiscoveryPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="text-white">Chargement...</div></div>}>
        <DiscoveryView />
      </Suspense>
    </AppLayout>
  );
}
