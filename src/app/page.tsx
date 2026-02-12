'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface Comic {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  featured?: boolean;
}

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
        <div className="w-24" />
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl max-h-full relative aspect-[3/4] w-full">
          <Image
            src={comic.thumbnail}
            alt={comic.title}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function EmptyGallery() {
  return (
    <div className="text-center py-16">
      <div className="inline-block p-8 rounded-3xl bg-white/5 border border-white/10">
        <span className="text-7xl block mb-4">🎨</span>
        <h3 className="text-2xl font-bold text-white mb-2">Gallery Coming Soon!</h3>
        <p className="text-purple-300/70 max-w-md">
          Amazing comics are being created. Check back soon for awesome artwork!
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const [comics, setComics] = useState<Comic[]>([]);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComics() {
      try {
        const res = await fetch('/api/comics');
        if (res.ok) {
          const data = await res.json();
          setComics(data);
        }
      } catch (error) {
        console.error('Failed to fetch comics:', error);
      }
      setIsLoading(false);
    }
    fetchComics();
  }, []);

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
          {/* Admin Link */}
          <div className="absolute top-4 right-4">
            {session ? (
              <Link
                href="/admin"
                className="px-4 py-2 text-sm text-purple-300/70 hover:text-white border border-purple-500/30 hover:border-purple-500 rounded-lg transition-colors"
              >
                ✏️ Admin
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-purple-300/50 hover:text-purple-300 transition-colors"
              >
                🔐
              </Link>
            )}
          </div>

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
          {isLoading ? (
            <div className="text-center py-16">
              <div className="text-5xl animate-pulse">🎨</div>
              <p className="text-purple-300/50 mt-4">Loading gallery...</p>
            </div>
          ) : comics.length === 0 ? (
            <EmptyGallery />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {comics.map((comic) => (
                <ComicCard
                  key={comic.id}
                  comic={comic}
                  onClick={() => setSelectedComic(comic)}
                />
              ))}
            </div>
          )}
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
