'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold text-navy">Something went wrong</h1>
      <p className="text-gray-600 max-w-md">
        An unexpected error occurred. Please try again, or return to the home page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2 bg-cta text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-2 border border-navy text-navy rounded-lg font-semibold hover:bg-navy hover:text-white transition"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
