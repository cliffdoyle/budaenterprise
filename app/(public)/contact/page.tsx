import type { Metadata } from 'next';
import ContactForm from '@/components/public/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Vimilip Enterprise for transport, plumbing or painting services in Kisumu. Call, WhatsApp or send a message.',
};

export default function ContactPage() {
  return <ContactForm />;
}
