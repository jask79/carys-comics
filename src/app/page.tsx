'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Comic {
  id: number;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  pages: string[];
  featured?: boolean;
}

const placeholderComics: Comic[] = [
  {
    id: 1,
    title: "The Amazing Adventure",
    description: "Join our heroes on an epic journey through magical lands!",
    date: "2024-01-15",
    thumbnail: "/comics/placeholder-1.svg",
    pages: ["/comics/placeholder-1.svg"],
    featured: true,
  },
  {
    id: 2,
    title: "Space Explorers",
    description: "Blast off into the cosmos with the bravest crew in the galaxy.",
    date: "2024-01-20",
    thumbnail: "/comics/placeholder-2.svg",
    pages: ["/comics/placeholder-2.svg"],
  },
  {
    id: 3,
    title: "The Secret Garden",
    description: "Discover the mysteries hidden in a magical garden.",
    date: "2024-02-01",
    thumbnail: "/comics/placeholder-3.svg",
    pages: ["/comics/placeholder-3.svg"],
  },
  {
    id: 4,
    title: "Robot Friends",
    description: "When robots learn about friendship, anything is possible!",
    date: "2024-02-10",
    thumbnail: "/comics/placeholder-4.svg",
    pages: ["/comics/placeholder-4.svg"],
  },
];

function ComicCard({ comic, onClick }: { comic: Comic; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 text-left ${
        comic.featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        <Image
          src={comic.thumbnail}
          alt={comic.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {comic.featured && (
          <span className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
            ✨ FEATURED
          </span>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className={`font-bold text-white mb-1 ${comic.featured ? 'text-2xl' : 'text-lg'}`}>
          {comic.title}
        </h3>
        <p className="text-white/70 text-sm line-clamp-2">{comic.description}</p>
        <p className="text-purple-300 text-xs mt-2">{new Date(comic.date).toLocaleDateString()}</p>
      </div>
    </button>
  );
}

function ComicViewer({ comic, onClose }: { comic: Comic; onClose: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Gallery
        </button>
        <h2 className="text-white font-bold">{comic.title}</h2>
        <span className="text-white/50 text-sm">
          Page {currentPage + 1} of {comic.pages.length}
        </span>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="max-w-4xl max-h-full relative aspect-[3/4] w-full">
          <Image
            src={comic.pages[currentPage]}
            alt={`${comic.title} - Page ${currentPage + 1}`}
            fill
            className="object-contain"
          />
        </div>
        
        <button
          onClick={() => setCurrentPage(Math.min(comic.pages.length - 1, currentPage + 1))}
          disabled={currentPage === comic.pages.length - 1}
          className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-12 px-4">
          <div className="inline-block mb-4">
            <span className="text-6xl">🎨</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Carys Comics
          </h1>
          <p className="text-xl text-purple-200/70 max-w-md mx-auto">
            A magical gallery of original comics and artwork
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-purple-300/50 text-sm">
            <span className="w-8 h-px bg-purple-500/30" />
            <span>✦</span>
            <span className="w-8 h-px bg-purple-500/30" />
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {placeholderComics.map((comic) => (
              <ComicCard
                key={comic.id}
                comic={comic}
                onClick={() => setSelectedComic(comic)}
              />
            ))}
          </div>

          {/* Empty state hint */}
          <div className="mt-16 text-center">
            <div className="inline-block p-6 rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5">
              <p className="text-purple-300/70">
                🚀 More comics coming soon!
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/5">
          <p className="text-purple-300/50 text-sm">
            Made with 💜 by Carys
          </p>
        </footer>
      </div>

      {/* Comic Viewer Modal */}
      {selectedComic && (
        <ComicViewer comic={selectedComic} onClose={() => setSelectedComic(null)} />
      )}
    </div>
  );
}
