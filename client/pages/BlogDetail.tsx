import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Send,
  MoreHorizontal 
} from "lucide-react";
import Header from "@/components/Header";
import { BlogPost, Comment, BlogDetailResponse } from "@shared/api";

// Mock data - replace with actual API calls
const mockBlogPost = {
  id: 1,
  title: "The Future of Web Development: What to Expect in 2024",
  content: `
    <div class="prose max-w-none">
      <p class="text-lg text-muted-foreground mb-6">Web development continues to evolve at a rapid pace, with new technologies and methodologies emerging regularly. As we move through 2024, several key trends are shaping the future of how we build and interact with web applications.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">AI Integration in Development</h2>
      <p>Artificial Intelligence is no longer just a buzzword in web development. Tools like GitHub Copilot, ChatGPT, and Claude are revolutionizing how developers write code, debug issues, and architect applications.</p>
      
      <blockquote class="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        "AI is not replacing developers; it's making them more efficient and creative." - Industry Expert
      </blockquote>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Server Components and React 18</h2>
      <p>React Server Components represent a paradigm shift in how we think about rendering. By allowing components to run on the server, we can reduce bundle sizes and improve performance significantly.</p>
      
      <ul class="list-disc pl-6 my-4 space-y-2">
        <li>Reduced JavaScript bundle sizes</li>
        <li>Better SEO and initial page load times</li>
        <li>Seamless integration with existing React applications</li>
        <li>Enhanced developer experience with zero-config</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Rise of Edge Computing</h2>
      <p>Edge computing is bringing computation closer to users, reducing latency and improving user experience. Platforms like Vercel Edge Functions and Cloudflare Workers are making edge deployment accessible to all developers.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">TypeScript Everywhere</h2>
      <p>TypeScript adoption has reached a tipping point. From frontend frameworks to backend APIs, TypeScript is becoming the default choice for new projects, offering better developer experience and fewer runtime errors.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
      <p>The future of web development is exciting and full of possibilities. As these technologies mature and new ones emerge, developers who stay curious and adaptable will be best positioned to build the next generation of web applications.</p>
    </div>
  `,
  author: {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    bio: "Senior Full Stack Developer at TechCorp",
    followers: 1250,
    articles: 45
  },
  publishedAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T14:20:00Z",
  readTime: "8 min read",
  category: "Technology",
  tags: ["React", "AI", "TypeScript", "Web Development"],
  imageUrl: "/placeholder.svg",
  likes: 234,
  isLiked: false,
  isBookmarked: false,
  comments: 45,
  views: 3200
};

const mockComments = [
  {
    id: 1,
    author: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg"
    },
    content: "Great article! I'm particularly excited about Server Components. The performance implications are huge.",
    publishedAt: "2024-01-15T16:45:00Z",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 11,
        author: {
          name: "Sarah Chen",
          avatar: "/placeholder.svg"
        },
        content: "Thanks Alex! Yes, Server Components are game-changing. I've seen 40-50% bundle size reductions in some cases.",
        publishedAt: "2024-01-15T17:15:00Z",
        likes: 8,
        isLiked: false
      }
    ]
  },
  {
    id: 2,
    author: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg"
    },
    content: "The AI integration section resonates with me. I've been using Copilot for 6 months now and my productivity has increased significantly.",
    publishedAt: "2024-01-15T18:20:00Z",
    likes: 15,
    isLiked: false,
    replies: []
  },
  {
    id: 3,
    author: {
      name: "Michael Park",
      avatar: "/placeholder.svg"
    },
    content: "Edge computing is definitely the future. The latency improvements are noticeable, especially for global applications.",
    publishedAt: "2024-01-16T09:10:00Z",
    likes: 7,
    isLiked: false,
    replies: []
  }
];

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog post and comments
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch blog post
        const blogResponse = await fetch(`/api/blogs/${id}`);
        if (!blogResponse.ok) {
          throw new Error('Blog post not found');
        }
        const blogData: BlogDetailResponse = await blogResponse.json();
        setPost(blogData.blog);

        // Fetch comments
        const commentsResponse = await fetch(`/api/blogs/${id}/comments`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments || []);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching blog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/blogs/${post.id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setPost(prev => prev ? {
          ...prev,
          isLiked: data.isLiked,
          likes: data.likes
        } : null);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/blogs/${post.id}/bookmark`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setPost(prev => prev ? {
          ...prev,
          isBookmarked: data.isBookmarked
        } : null);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !post) return;

    try {
      const response = await fetch(`/api/blogs/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data.comment]);
        setNewComment("");

        // Update comment count on post
        setPost(prev => prev ? {
          ...prev,
          comments: prev.comments + 1
        } : null);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Article not found'}</p>
            <Link to="/blogs">
              <Button>Back to Articles</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Link to="/blogs" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>

        {/* Article Header */}
        <article className="space-y-8">
          <header className="space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">{post.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">{post.author.bio}</div>
                  <div className="text-xs text-muted-foreground">
                    {post.author.followers} followers · {post.author.articles} articles
                  </div>
                </div>
              </div>
              <Button variant="outline">Follow</Button>
            </div>

            {/* Meta Info */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
              <div>{post.views.toLocaleString()} views</div>
            </div>

            {/* Featured Image */}
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </header>

          {/* Article Actions */}
          <div className="flex items-center justify-between py-4 border-y">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={post.isLiked ? "text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? "fill-current" : ""}`} />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                {comments.length}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={post.isBookmarked ? "text-primary" : ""}
              >
                <Bookmark className={`w-4 h-4 ${post.isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-8">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>
        </article>

        <Separator className="my-12" />

        {/* Comments Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Add Comment */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button onClick={handleComment} disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map(comment => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>{comment.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{comment.author.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatTimeAgo(comment.publishedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-foreground">{comment.content}</p>
                    
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        Reply
                      </Button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 space-y-4 border-l-2 border-muted pl-4">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={reply.author.avatar} />
                                <AvatarFallback>{reply.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm text-foreground">{reply.author.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTimeAgo(reply.publishedAt)}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-foreground">{reply.content}</p>
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm" className="text-xs">
                                <Heart className="w-3 h-3 mr-1" />
                                {reply.likes}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
