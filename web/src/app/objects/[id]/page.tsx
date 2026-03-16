'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { objectsApi, HeyamaObject } from '@/lib/api';
import { ArrowLeft, Trash2, Calendar, Link2 } from 'lucide-react';
import Link from 'next/link';

export default function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [obj, setObj] = useState<HeyamaObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    objectsApi.getOne(id)
      .then(setObj)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this object?')) return;
    await objectsApi.remove(id);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="h-72 bg-gray-200 animate-pulse rounded-xl" />
        <div className="mt-4 h-6 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="mt-2 h-4 w-full bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  if (notFound || !obj) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Object not found.</p>
        <Link href="/" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">← Back to list</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-72 bg-gray-100">
          <img
            src={obj.imageUrl}
            alt={obj.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=No+Image';
            }}
          />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{obj.title}</h1>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors whitespace-nowrap"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>

          <p className="text-gray-600 mt-3 leading-relaxed">{obj.description}</p>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Created {new Date(obj.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link2 size={14} />
              <a href={obj.imageUrl} target="_blank" rel="noreferrer" className="truncate hover:text-indigo-600 underline">
                {obj.imageUrl}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
