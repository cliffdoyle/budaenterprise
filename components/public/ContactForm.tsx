'use client';

import { useState } from 'react';
import { Phone, MessageSquare, Clock, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Toast, useToast } from '@/components/ui/Toast';

const SERVICES = [
  { value: 'transport', label: 'Transport / Delivery' },
  { value: 'plumbing',  label: 'Plumbing' },
  { value: 'painting',  label: 'Painting' },
  { value: 'general',   label: 'General Enquiry' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast, show, hide } = useToast();

  const phone = process.env.NEXT_PUBLIC_PHONE ?? '+254 712 345 678';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254712345678';
  const mapsEmbed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) errs.name = 'Enter your name (min 2 characters)';
    if (!form.phone.trim() || form.phone.length < 7) errs.phone = 'Enter a valid phone number';
    if (!form.service) errs.service = 'Please select a service';
    if (!form.message.trim() || form.message.length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Submission failed');
      show('Message sent! We will be in touch shortly.', 'success');
      setForm({ name: '', phone: '', service: '', message: '' });
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/40 focus:border-navy transition-colors';
  const errorClass = 'text-red-600 text-xs mt-1';

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-white py-14 px-4 text-center">
        <p className="text-cta text-xs uppercase tracking-widest font-semibold mb-2">Get in Touch</p>
        <h1 className="text-4xl font-extrabold">Contact Us</h1>
        <p className="mt-2 text-white/70 max-w-md mx-auto">
          Send us a message, call, or WhatsApp — we respond quickly.
        </p>
      </section>

      <section className="py-16 bg-warm-white">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-navy mb-5">Send a Message</h2>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. John Otieno"
                />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="+254 700 000 000"
                />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="service">
                  Service Needed <span className="text-red-500">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select a service…</option>
                  {SERVICES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {errors.service && <p className={errorClass}>{errors.service}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Tell us what you need…"
                />
                {errors.message && <p className={errorClass}>{errors.message}</p>}
              </div>

              <Button type="submit" loading={loading} size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            {/* Contact details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="text-xl font-bold text-navy mb-4">Other Ways to Reach Us</h2>
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-gray-700 hover:text-navy transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-navy" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call us</p>
                  <p className="font-semibold">{phone}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${whatsapp}?text=Hello%2C%20I%20need%20a%20quote`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                  <p className="font-semibold">Chat with us</p>
                </div>
              </a>

              <div className="flex items-start gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Business Hours</p>
                  <p className="font-semibold text-sm">Mon–Sat 7 am–6 pm</p>
                  <p className="text-xs text-gray-500">Sun by appointment</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-navy" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold">Kisumu, Kenya</p>
                </div>
              </div>
            </div>

            {/* Map */}
            {mapsEmbed && (
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-56">
                <iframe
                  src={mapsEmbed}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kisumu service area map"
                  className="border-0"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={hide} />
        </div>
      )}
    </>
  );
}
