import React, { useEffect, useMemo, useState } from 'react';

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function truncate(text, max = 100) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [viewGrid, setViewGrid] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => p.title.toLowerCase().includes(q));
  }, [posts, query]);

  const visiblePosts = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">MapIot.ai — Posts</h1>
            <p className="text-sm text-slate-500">Small frontend task: fetch & display posts</p>
          </div>

          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              aria-label="Search posts by title"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(10);
              }}
              className="flex-1 md:flex-none border border-slate-200 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
              placeholder="Search by title..."
            />

            <button
              onClick={() => setViewGrid((v) => !v)}
              className="px-3 py-2 border rounded-md shadow-sm hover:bg-slate-100"
              title="Toggle grid / list view"
            >
              {viewGrid ? "List view" : "Grid view"}
            </button>
          </div>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <p className="mt-3 text-slate-600">Loading posts…</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <strong>Could not load posts.</strong>
                <div className="text-sm mt-1">{error}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchPosts()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md shadow-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="p-6 bg-white rounded-md text-slate-600 text-center">
            No posts match your search.
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className={viewGrid ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col divide-y"}>
              {visiblePosts.map((post) => (
                <article key={post.id} className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition">
                  <h2 className="font-semibold mb-2 text-slate-800">{post.title}</h2>
                  <p className="text-sm text-slate-600">{truncate(post.body, 100)}</p>
                  <div className="mt-3 text-xs text-slate-400">Post ID: {post.id}</div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center">
              {visibleCount < filtered.length ? (
                <button
                  onClick={() => setVisibleCount((v) => v + 10)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm"
                >
                  Load more ({Math.min(10, filtered.length - visibleCount)})
                </button>
              ) : (
                <span className="text-sm text-slate-500">Showing all {filtered.length} posts</span>
              )}
            </div>
          </>
        )}

        <footer className="mt-8 text-xs text-slate-400 text-center">
          Built to match the MapIot.ai frontend assignment.
        </footer>
      </div>
    </div>
  );
}
