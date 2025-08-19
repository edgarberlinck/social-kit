import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Image,
  BarChart3,
  Send,
  Trash2,
  Edit,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePosts } from "@/hooks/usePosts";
import { format } from "date-fns";

const platforms = [
  { name: "Twitter", color: "bg-blue-500", icon: "🐦" },
  { name: "Facebook", color: "bg-blue-600", icon: "📘" },
  { name: "Instagram", color: "bg-pink-500", icon: "📸" },
  { name: "LinkedIn", color: "bg-blue-700", icon: "💼" },
];

export default function SocialMediaScheduler() {
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { posts, loading, createPost, deletePost } = usePosts();

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedulePost = async () => {
    if (!postContent.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform Required",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost({
        content: postContent,
        platforms: selectedPlatforms,
      });

      toast({
        title: "Post Created! 🎉",
        description: `Your post has been saved for ${selectedPlatforms.join(
          ", "
        )}.`,
      });

      setPostContent("");
      setSelectedPlatforms([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      toast({
        title: "Post Deleted",
        description: "Your post has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "scheduled":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const scheduledPostsCount = posts.filter(
    (p) => p.status === "scheduled"
  ).length;
  const publishedPostsCount = posts.filter(
    (p) => p.status === "published"
  ).length;
  const totalPostsThisWeek = posts.filter((p) => {
    const postDate = new Date(p.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return postDate > weekAgo;
  }).length;

  return (
    <div className="space-y-8">
      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Composer */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Compose Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="What's happening? Share your thoughts..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-32 text-lg border-0 bg-secondary/50 focus:bg-white transition-colors"
              />

              <div>
                <p className="text-sm font-medium mb-3">Select Platforms:</p>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.name}
                      variant={
                        selectedPlatforms.includes(platform.name)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => togglePlatform(platform.name)}
                      className="flex items-center gap-2"
                    >
                      <span>{platform.icon}</span>
                      {platform.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Add Media
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </Button>
                <Button
                  onClick={handleSchedulePost}
                  disabled={isSubmitting}
                  className="bg-gradient-primary hover:opacity-90 text-white flex items-center gap-2 ml-auto"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Posts This Week</span>
                <Badge variant="secondary" className="text-lg font-semibold">
                  {totalPostsThisWeek}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Scheduled</span>
                <Badge variant="secondary" className="text-lg font-semibold">
                  {scheduledPostsCount}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Published</span>
                <Badge variant="secondary" className="text-lg font-semibold">
                  {publishedPostsCount}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Next Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              {posts.find((p) => p.status === "scheduled") ? (
                <>
                  <p className="font-medium">
                    {format(
                      new Date(
                        posts.find(
                          (p) => p.status === "scheduled"
                        )!.scheduled_for!
                      ),
                      "PPp"
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {posts
                      .find((p) => p.status === "scheduled")!
                      .platforms.join(" & ")}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No scheduled posts
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <div className="mt-12 col-span-full">
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No posts yet. Create your first post above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <p className="flex-1">{post.content}</p>
                        <div className="flex gap-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.platforms.map((platform) => (
                            <Badge
                              key={platform}
                              variant="outline"
                              className="text-xs"
                            >
                              {platforms.find((p) => p.name === platform)?.icon}{" "}
                              {platform}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {post.scheduled_for
                            ? format(new Date(post.scheduled_for), "PPp")
                            : format(new Date(post.created_at), "PPp")}
                          <Badge
                            variant={getStatusColor(post.status)}
                            className="ml-2"
                          >
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
