'use client';
import Link from 'next/link';
import { Trash2, Eye } from 'lucide-react';
import { HeyamaObject, objectsApi } from '@/lib/api';

interface Props {
  obj: HeyamaObject;
  onDeleted: (id: string) => void;
}

export default function ObjectCard({ obj, onDeleted }: Props) {
  const handleDelete = async () => {
    if (!confirm('Delete this object?')) return;
    await objectsApi.remove(obj._id);
    onDeleted(obj._id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100">
        <img
          src={obj.imageUrl}
          alt={obj.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=No+Image';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{obj.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{obj.description}</p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(obj.createdAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2 mt-3">
          <Link
            href={`/objects/${obj._id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors"
          >
            <Eye size={14} /> View
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
