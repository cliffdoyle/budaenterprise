'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Toast, useToast } from '@/components/ui/Toast';
import type { PortfolioImage } from '@/lib/types';

const SERVICE_OPTIONS = [
  { value: 'transport', label: 'Transport' },
  { value: 'plumbing',  label: 'Plumbing' },
  { value: 'painting',  label: 'Painting' },
];

export default function GalleryManagerPage() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadService, setUploadService] = useState('transport');
  const [progress, setProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast, show, hide } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/portfolio?all=true');
      const json = await res.json();
      setImages(json.data ?? []);
    } catch {
      show('Failed to load images', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      show('Only JPEG, PNG or WEBP images are allowed', 'error'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      show('Image must be under 5 MB', 'error'); return;
    }

    setUploading(true);
    setProgress(20);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('service_slug', uploadService);
      setProgress(50);
      const res = await fetch('/api/portfolio', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      setProgress(100);
      show('Image uploaded successfully', 'success');
      fetchImages();
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleCaptionBlur = async (img: PortfolioImage, caption: string) => {
    if (caption === img.caption) return;
    try {
      await fetch(`/api/portfolio/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });
      setImages((imgs) => imgs.map((i) => (i.id === img.id ? { ...i, caption } : i)));
    } catch {
      show('Failed to save caption', 'error');
    }
  };

  const handleServiceChange = async (img: PortfolioImage, service_slug: string) => {
    try {
      await fetch(`/api/portfolio/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_slug }),
      });
      setImages((imgs) => imgs.map((i) => (i.id === img.id ? { ...i, service_slug: service_slug as PortfolioImage['service_slug'] } : i)));
      show('Tag updated', 'success');
    } catch {
      show('Failed to update tag', 'error');
    }
  };

  const handleDelete = async (img: PortfolioImage) => {
    if (!confirm(`Delete this image? This cannot be undone.`)) return;
    setDeletingId(img.id);
    try {
      const res = await fetch(`/api/portfolio/${img.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setImages((imgs) => imgs.filter((i) => i.id !== img.id));
      show('Image deleted', 'success');
    } catch {
      show('Failed to delete image', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Gallery Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Upload, tag and manage portfolio images.</p>
      </div>

      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-navy/30 rounded-xl p-8 text-center bg-white mb-8 hover:border-navy/60 transition-colors cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={32} className="text-navy/40 mx-auto mb-2" />
        <p className="font-semibold text-navy">Drag & drop or click to upload</p>
        <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP — max 5 MB</p>
        <div className="flex items-center justify-center gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
          <select
            value={uploadService}
            onChange={(e) => setUploadService(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
          >
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Button
            size="sm"
            loading={uploading}
            onClick={() => fileRef.current?.click()}
          >
            Choose File
          </Button>
        </div>
        {uploading && (
          <div className="mt-3 w-full max-w-xs mx-auto h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Images grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={img.url}
                  alt={img.caption ?? 'Portfolio image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="p-3 space-y-2">
                <input
                  defaultValue={img.caption ?? ''}
                  placeholder="Add caption…"
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-navy/30"
                  onBlur={(e) => handleCaptionBlur(img, e.target.value)}
                />
                <div className="flex items-center gap-1">
                  <Tag size={12} className="text-gray-400 shrink-0" />
                  <select
                    value={img.service_slug}
                    onChange={(e) => handleServiceChange(img, e.target.value)}
                    className="flex-1 text-xs border border-gray-200 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-navy/30"
                  >
                    {SERVICE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full text-xs"
                  loading={deletingId === img.id}
                  onClick={() => handleDelete(img)}
                >
                  <Trash2 size={12} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={hide} />
        </div>
      )}
    </div>
  );
}
