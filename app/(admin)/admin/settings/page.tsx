'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { Toast, useToast } from '@/components/ui/Toast';
import type { SiteSettings } from '@/lib/types';

const FIELDS: { key: keyof SiteSettings; label: string; type?: string; placeholder: string }[] = [
  { key: 'phone',          label: 'Display Phone',     placeholder: '+254 712 345 678' },
  { key: 'whatsapp',       label: 'WhatsApp Number',   placeholder: '254712345678 (international, no +)' },
  { key: 'email',          label: 'Email Address',     type: 'email', placeholder: 'info@vimilipenterprise.co.ke' },
  { key: 'address',        label: 'Business Address',  placeholder: 'Kisumu, Kenya' },
  { key: 'business_hours', label: 'Business Hours',    placeholder: 'Mon–Sat 7 am–6 pm | Sun by appointment' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    phone: '', whatsapp: '', email: '', address: '', business_hours: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, show, hide } = useToast();

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((j) => { if (j.data) setSettings(j.data); setLoading(false); })
      .catch(() => { show('Failed to load settings', 'error'); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Save failed');
      show('Settings saved', 'success');
    } catch {
      show('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonTable rows={5} />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Update your business contact details.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium text-gray-700 block mb-1">{field.label}</label>
            <input
              type={field.type ?? 'text'}
              value={settings[field.key]}
              onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>
        ))}
        <Button onClick={handleSave} loading={saving} size="lg" className="w-full mt-2">
          <Save size={14} /> Save Settings
        </Button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={hide} />
        </div>
      )}
    </div>
  );
}
