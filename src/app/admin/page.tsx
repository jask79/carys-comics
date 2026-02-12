'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Comic {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  featured: boolean;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [comics, setComics] = useState<Comic[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingComic, setEditingComic] = useState<Comic | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchComics = useCallback(async () => {
    const res = await fetch("/api/comics");
    if (res.ok) {
      const data = await res.json();
      setComics(data);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchComics();
    }
  }, [status, fetchComics]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", featured: false });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingComic(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !editingComic) return;

    setIsUploading(true);

    try {
      let imageUrl = editingComic?.thumbnail;

      // Upload new image if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      // Save comic data
      const comicData = {
        id: editingComic?.id,
        title: formData.title,
        description: formData.description,
        thumbnail: imageUrl,
        featured: formData.featured,
      };

      const res = await fetch("/api/comics", {
        method: editingComic ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comicData),
      });

      if (res.ok) {
        await fetchComics();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving comic:", error);
      alert("Failed to save comic. Please try again!");
    }

    setIsUploading(false);
  };

  const handleEdit = (comic: Comic) => {
    setEditingComic(comic);
    setFormData({
      title: comic.title,
      description: comic.description,
      featured: comic.featured,
    });
    setPreviewUrl(comic.thumbnail);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comic?")) return;

    const res = await fetch(`/api/comics?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchComics();
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-5xl animate-pulse">🎨</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            <div>
              <h1 className="text-xl font-bold text-white">Comic Studio</h1>
              <p className="text-purple-300/50 text-sm">Welcome, {session.user?.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-purple-300/70 hover:text-white text-sm transition-colors">
              View Gallery →
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">My Comics</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <span>➕</span> Add New Comic
          </button>
        </div>

        {/* Upload Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingComic ? "Edit Comic" : "Upload New Comic"}
                </h3>
                <button onClick={resetForm} className="text-white/50 hover:text-white text-2xl">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-purple-300/70 text-sm mb-2">
                    Comic Cover {!editingComic && "*"}
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                      previewUrl ? "border-purple-500" : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {previewUrl ? (
                      <div className="relative aspect-[3/4] max-h-64 mx-auto">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(editingComic?.thumbnail || null);
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-8">
                        <span className="text-4xl block mb-2">📁</span>
                        <span className="text-white/70">Click to select artwork</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-purple-300/70 text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="My Amazing Comic"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-purple-300/70 text-sm mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What's this comic about?"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                {/* Featured Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white">⭐ Feature this comic</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isUploading || (!selectedFile && !editingComic)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading... ✨" : editingComic ? "Save Changes" : "Upload Comic 🚀"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Comics Grid */}
        {comics.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🖼️</span>
            <p className="text-purple-300/70 text-lg">No comics yet!</p>
            <p className="text-purple-300/50">Click "Add New Comic" to upload your first artwork.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {comics.map((comic) => (
              <div
                key={comic.id}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={comic.thumbnail}
                    alt={comic.title}
                    fill
                    className="object-cover"
                  />
                  {comic.featured && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(comic)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comic.id)}
                      className="px-4 py-2 bg-pink-500/50 hover:bg-pink-500/70 text-white rounded-lg transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white truncate">{comic.title}</h3>
                  <p className="text-purple-300/50 text-sm truncate">{comic.description || "No description"}</p>
                  <p className="text-purple-300/30 text-xs mt-2">
                    {new Date(comic.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
