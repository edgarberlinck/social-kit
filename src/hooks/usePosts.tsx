import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Post {
  id: string;
  content: string;
  media_urls: string[];
  platforms: string[];
  scheduled_for: string | null;
  status: "draft" | "scheduled" | "published" | "failed";
  published_at: string | null;
  engagement_metrics: any;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts((data || []) as Post[]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    content: string;
    platforms: string[];
    media_urls?: string[];
    scheduled_for?: string;
  }) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          user_id: user.id,
          content: postData.content,
          platforms: postData.platforms,
          media_urls: postData.media_urls || [],
          scheduled_for: postData.scheduled_for || null,
          status: postData.scheduled_for ? "scheduled" : "draft",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    setPosts((prev) => [data as Post, ...prev]);
    return data;
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    setPosts((prev) =>
      prev.map((post) => (post.id === id ? (data as Post) : post))
    );
    return data;
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;

    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
}
