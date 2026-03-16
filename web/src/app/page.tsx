'use client';
import { useEffect, useState } from 'react';
import { objectsApi, HeyamaObject } from '@/lib/api';
import ObjectCard from '@/components/ObjectCard';
import CreateObjectForm from '@/components/CreateObjectForm';
import { useSocket } from '@/lib/useSocket';
import { Wifi, WifiOff } from 'lucide-react';

export default function HomePage() {
  const [objects, setObjects] = useState<HeyamaObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    objectsApi.getAll()
      .then(setObjects)
      .finally(() => setLoading(false));
  }, []);

  useSocket(
    (obj: HeyamaObject) => {
      setConnected(true);
      setObjects((prev) => {
        if (prev.find((o) => o._id === obj._id)) return prev;
        return [obj, ...prev];
      });
    },
    ({ id }) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    },
  );

  useEffect(() => {
    // Show connected state briefly when socket fires
    if (connected) {
      const t = setTimeout(() => setConnected(false), 3000);
      return () => clearTimeout(t);
    }
  }, [connected]);

  const handleCreated = (obj: HeyamaObject) => {
    setObjects((prev) => [obj, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setObjects((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Objects</h1>
          <p className="text-sm text-gray-500 mt-0.5">{objects.length} item{objects.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connected ? 'Live update!' : 'Live'}
          </span>
          <CreateObjectForm onCreated={handleCreated} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-64 animate-pulse" />
          ))}
        </div>
      ) : objects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No objects yet</p>
          <p className="text-sm mt-1">Create one to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {objects.map((obj) => (
            <ObjectCard key={obj._id} obj={obj} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
