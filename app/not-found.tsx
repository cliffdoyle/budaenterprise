import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <span className="text-8xl font-black text-navy opacity-10 select-none">404</span>
      <h1 className="text-3xl font-bold text-navy -mt-10">Page Not Found</h1>
      <p className="text-gray-600 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-cta text-white rounded-lg font-semibold hover:opacity-90 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}
