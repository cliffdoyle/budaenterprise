'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Eye, EyeOff, School } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { Toast, useToast } from '@/components/ui/Toast';
import type { School as SchoolType } from '@/lib/types';

const EMPTY: Partial<SchoolType> = {
  name: '', work_description: '', testimonial: '', year: undefined, is_visible: true,
};

export default function SchoolsManagerPage() {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<SchoolType>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast, show, hide } = useToast();

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools?all=true');
      const json = await res.json();
      setSchools(json.data ?? []);
    } catch {
      show('Failed to load schools', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, []);

  const openAdd = () => { setEditing(EMPTY); setModalOpen(true); };
  const openEdit = (s: SchoolType) => { setEditing(s); setModalOpen(true); };

  const handleSave = async () => {
    if (!editing.name?.trim()) { show('School name is required', 'error'); return; }
    if (!editing.work_description?.trim()) { show('Work description is required', 'error'); return; }
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? '/api/schools' : `/api/schools/${editing.id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error('Save failed');
      show(isNew ? 'School added' : 'School updated', 'success');
      setModalOpen(false);
      fetchSchools();
    } catch {
      show('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (s: SchoolType) => {
    try {
      await fetch(`/api/schools/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !s.is_visible }),
      });
      setSchools((list) => list.map((x) => (x.id === s.id ? { ...x, is_visible: !x.is_visible } : x)));
    } catch {
      show('Failed to update visibility', 'error');
    }
  };

  const handleDelete = async (s: SchoolType) => {
    if (!confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    setDeletingId(s.id);
    try {
      await fetch(`/api/schools/${s.id}`, { method: 'DELETE' });
      setSchools((list) => list.filter((x) => x.id !== s.id));
      show('School deleted', 'success');
    } catch {
      show('Delete failed', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Schools Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage school partnerships and testimonials.</p>
        </div>
        <Button onClick={openAdd}><Plus size={14} /> Add School</Button>
      </div>

      {loading ? (
        <SkeletonTable rows={4} />
      ) : schools.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No schools added yet.</p>
      ) : (
        <div className="space-y-3">
          {schools.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                {s.logo_url ? (
                  <Image src={s.logo_url} alt={s.name} width={40} height={40} className="object-contain rounded" />
                ) : (
                  <School size={20} className="text-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-navy text-sm truncate">{s.name}</p>
                  {s.year && <span className="text-xs text-gray-400">({s.year})</span>}
                  {!s.is_visible && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{s.work_description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleVisible(s)}
                  className="p-1.5 text-gray-400 hover:text-navy transition-colors"
                  aria-label={s.is_visible ? 'Hide' : 'Show'}
                >
                  {s.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => openEdit(s)}
                  className="p-1.5 text-gray-400 hover:text-accent transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deletingId === s.id}
                  onClick={() => handleDelete(s)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Edit School' : 'Add School'}>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">School Name *</label>
            <input
              value={editing.name ?? ''}
              onChange={(e) => setEditing((x) => ({ ...x, name: e.target.value }))}
              className={inputCls}
              placeholder="e.g. Kisumu Boys High School"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Work Done *</label>
            <textarea
              rows={2}
              value={editing.work_description ?? ''}
              onChange={(e) => setEditing((x) => ({ ...x, work_description: e.target.value }))}
              className={inputCls}
              placeholder="Describe the work done at this institution"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Testimonial (optional)</label>
            <textarea
              rows={2}
              value={editing.testimonial ?? ''}
              onChange={(e) => setEditing((x) => ({ ...x, testimonial: e.target.value }))}
              className={inputCls}
              placeholder="Quote from the school (optional)"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Year</label>
              <input
                type="number"
                min={2000}
                max={2050}
                value={editing.year ?? ''}
                onChange={(e) => setEditing((x) => ({ ...x, year: e.target.value ? parseInt(e.target.value) : undefined }))}
                className={inputCls}
                placeholder="2024"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_visible ?? true}
                  onChange={(e) => setEditing((x) => ({ ...x, is_visible: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Visible on site</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={saving} className="flex-1">
              Save School
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={hide} />
        </div>
      )}
    </div>
  );
}
