'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { Toast, useToast } from '@/components/ui/Toast';
import type { Service } from '@/lib/types';

const MAX_TITLE = 200;
const MAX_DESC = 2000;

export default function ServicesEditorPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const { toast, show, hide } = useToast();

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((j) => { setServices(j.data ?? []); setLoading(false); })
      .catch(() => { show('Failed to load services', 'error'); setLoading(false); });
  }, []);

  const update = (slug: string, field: string, value: unknown) => {
    setServices((svcs) =>
      svcs.map((s) => (s.slug === slug ? { ...s, [field]: value } : s))
    );
  };

  const updateFeature = (slug: string, idx: number, value: string) => {
    setServices((svcs) =>
      svcs.map((s) => {
        if (s.slug !== slug) return s;
        const features = [...s.features];
        features[idx] = value;
        return { ...s, features };
      })
    );
  };

  const addFeature = (slug: string) => {
    setServices((svcs) =>
      svcs.map((s) =>
        s.slug === slug ? { ...s, features: [...s.features, ''] } : s
      )
    );
  };

  const removeFeature = (slug: string, idx: number) => {
    setServices((svcs) =>
      svcs.map((s) =>
        s.slug === slug
          ? { ...s, features: s.features.filter((_, i) => i !== idx) }
          : s
      )
    );
  };

  const save = async (service: Service) => {
    setSaving(service.slug);
    try {
      const res = await fetch(`/api/services/${service.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: service.title,
          description: service.description,
          features: service.features.filter((f) => f.trim()),
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? 'Save failed');
      }
      show(`${service.slug} saved`, 'success');
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <SkeletonTable rows={6} />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Services Editor</h1>
        <p className="text-gray-500 text-sm mt-1">Edit headlines, descriptions and feature lists.</p>
      </div>

      <div className="space-y-4">
        {services.map((svc) => (
          <div key={svc.slug} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Accordion header */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(open === svc.slug ? null : svc.slug)}
            >
              <span className="font-semibold text-navy capitalize">{svc.slug}</span>
              <span className="text-gray-400 text-sm">{open === svc.slug ? '▲' : '▼'}</span>
            </button>

            {open === svc.slug && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
                {/* Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700">Headline</label>
                    <span className="text-xs text-gray-400">{svc.title.length}/{MAX_TITLE}</span>
                  </div>
                  <input
                    type="text"
                    maxLength={MAX_TITLE}
                    value={svc.title}
                    onChange={(e) => update(svc.slug, 'title', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <span className="text-xs text-gray-400">{svc.description.length}/{MAX_DESC}</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={MAX_DESC}
                    value={svc.description}
                    onChange={(e) => update(svc.slug, 'description', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Features</label>
                  <div className="space-y-2">
                    {svc.features.map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={feat}
                          onChange={(e) => updateFeature(svc.slug, idx, e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                          placeholder={`Feature ${idx + 1}`}
                        />
                        <button
                          onClick={() => removeFeature(svc.slug, idx)}
                          className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                          aria-label="Remove feature"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addFeature(svc.slug)}
                    className="mt-2 flex items-center gap-1 text-sm text-accent hover:text-navy transition-colors"
                  >
                    <Plus size={14} /> Add feature
                  </button>
                </div>

                <Button
                  onClick={() => save(svc)}
                  loading={saving === svc.slug}
                  className="mt-2"
                >
                  <Save size={14} /> Save Changes
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={hide} />
        </div>
      )}
    </div>
  );
}
