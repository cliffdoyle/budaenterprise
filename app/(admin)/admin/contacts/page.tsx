'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, CheckCheck, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { Toast, useToast } from '@/components/ui/Toast';
import type { Enquiry } from '@/lib/types';

export default function ContactsPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast, show, hide } = useToast();

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      const json = await res.json();
      setEnquiries(json.data ?? []);
    } catch {
      show('Failed to load enquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const markRead = async (e: Enquiry) => {
    if (e.is_read) return;
    try {
      await fetch(`/api/enquiries/${e.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true }),
      });
      setEnquiries((list) => list.map((x) => (x.id === e.id ? { ...x, is_read: true } : x)));
    } catch {
      show('Failed to mark as read', 'error');
    }
  };

  const handleDelete = async (e: Enquiry) => {
    if (!confirm('Delete this enquiry?')) return;
    setDeletingId(e.id);
    try {
      await fetch(`/api/enquiries/${e.id}`, { method: 'DELETE' });
      setEnquiries((list) => list.filter((x) => x.id !== e.id));
      show('Enquiry deleted', 'success');
    } catch {
      show('Delete failed', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id: string, e: Enquiry) => {
    setExpanded(expanded === id ? null : id);
    markRead(e);
  };

  const unread = enquiries.filter((e) => !e.is_read).length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Enquiries Inbox</h1>
          <p className="text-gray-500 text-sm mt-1">Contact form submissions from your website.</p>
        </div>
        {unread > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unread} unread
          </span>
        )}
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : enquiries.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No enquiries yet.</p>
      ) : (
        <div className="space-y-2">
          {enquiries.map((e) => (
            <div
              key={e.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                !e.is_read ? 'border-accent/40 bg-blue-50/30' : 'border-gray-100'
              }`}
            >
              {/* Row */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(e.id, e)}
              >
                {!e.is_read && (
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-label="Unread" />
                )}
                <div className="flex-1 grid grid-cols-3 sm:grid-cols-5 gap-2 min-w-0 text-sm">
                  <span className="font-semibold text-navy truncate">{e.name}</span>
                  <span className="text-gray-600 truncate">{e.phone}</span>
                  <span className="text-gray-500 capitalize hidden sm:block">{e.service}</span>
                  <span className="text-gray-500 truncate hidden sm:block">{e.message.slice(0, 40)}…</span>
                  <span className="text-xs text-gray-400">
                    {new Date(e.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {expanded === e.id ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
              </button>

              {/* Expanded */}
              {expanded === e.id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  <p className="text-sm text-gray-800 leading-relaxed">{e.message}</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/${e.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(e.name)}%2C%20thank%20you%20for%20your%20enquiry.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <MessageSquare size={12} /> WhatsApp Reply
                    </a>
                    {!e.is_read && (
                      <Button variant="outline" size="sm" onClick={() => markRead(e)}>
                        <CheckCheck size={12} /> Mark Read
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deletingId === e.id}
                      onClick={() => handleDelete(e)}
                    >
                      <Trash2 size={12} /> Delete
                    </Button>
                  </div>
                </div>
              )}
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
