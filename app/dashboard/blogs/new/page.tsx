"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewBlogPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    youtube_url: "",
    thumbnail_url: "",
    tags: "",
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const { data, error } = await supabase
        .from("blogs")
        .insert([
          {
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt || null,
            youtube_url: formData.youtube_url || null,
            thumbnail_url: formData.thumbnail_url || null,
            user_id: user.id,
            published: formData.published,
            tags: tagsArray.length > 0 ? tagsArray : null,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating blog:", error);
        alert("Failed to create blog post");
        return;
      }

      alert("Blog post created successfully!");
      router.push("/dashboard/blogs");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white/92 mb-2">
            Create New Blog Post
          </h1>
          <p className="text-[13px] text-white/64">
            Write a new blog post or convert from a YouTube video
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6">
            <label className="block text-[13px] font-medium text-white/92 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-[#171a1d] border border-gray-400/50 rounded-md px-4 py-2 text-white/92 placeholder:text-white/40 focus:outline-none focus:border-[#8952e0]"
              placeholder="Enter blog post title"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6">
            <label className="block text-[13px] font-medium text-white/92 mb-2">
              Excerpt
            </label>
            <input
              type="text"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full bg-[#171a1d] border border-gray-400/50 rounded-md px-4 py-2 text-white/92 placeholder:text-white/40 focus:outline-none focus:border-[#8952e0]"
              placeholder="Brief description of the blog post"
            />
          </div>

          {/* Content */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6">
            <label className="block text-[13px] font-medium text-white/92 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full bg-[#171a1d] border border-gray-400/50 rounded-md px-4 py-2 text-white/92 placeholder:text-white/40 focus:outline-none focus:border-[#8952e0] resize-y font-mono text-[13px]"
              placeholder="Write your blog content here... (Markdown supported)"
            />
          </div>

          {/* YouTube URL */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6">
            <label className="block text-[13px] font-medium text-white/92 mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleChange}
              className="w-full bg-[#171a1d] border border-gray-400/50 rounded-md px-4 py-2 text-white/92 placeholder:text-white/40 focus:outline-none focus:border-[#8952e0]"
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="mt-2 text-[12px] text-white/40">
              Optional: Link to the original YouTube video
            </p>
          </div>

          {/* Thumbnail URL */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6">
            <label className="block text-[13px] font-medium text-white/92 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="w-full bg-[#171a1d] border border-gray-400/50 rounded-md px-4 py-2 text-white/92 placeholder:text-white/40 focus:outline-none focus:border-[#8952e0]"
              placeholder="https://example.com/image.jpg"
            />
            {formData.thumbnail_url && (
              <div className="mt-4">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail preview"
                  className="max-w-xs rounded border border-gray-400/50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6">
            <label className="block text-[13px] font-medium text-white/92 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-[#171a1d] border border-gray-400/50 rounded-md px-4 py-2 text-white/92 placeholder:text-white/40 focus:outline-none focus:border-[#8952e0]"
              placeholder="technology, tutorial, ai (comma separated)"
            />
            <p className="mt-2 text-[12px] text-white/40">
              Separate tags with commas
            </p>
          </div>

          {/* Published Status */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    published: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-gray-400/50 bg-[#171a1d] text-[#8952e0] focus:ring-[#8952e0] focus:ring-offset-0"
              />
              <div>
                <div className="text-[13px] font-medium text-white/92">
                  Publish immediately
                </div>
                <div className="text-[12px] text-white/40">
                  Make this blog post publicly visible
                </div>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Blog Post"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-white/8 hover:bg-white/12 rounded-md text-white/92 text-[13px] font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
