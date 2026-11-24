import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070B0D] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-extrabold text-revora-sky font-heading">404</h1>
      <h2 className="text-2xl font-bold mt-4 font-heading">Page Not Found</h2>
      <p className="text-gray-400 mt-2 max-w-md">
        The vehicle listing or page you are looking for has been moved or does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-[#60ADD9] text-[#070B0D] font-bold rounded-xl uppercase tracking-wider text-sm hover:bg-[#4E9BC7] transition-colors"
      >
        Back to REVORA
      </Link>
    </div>
  );
}
