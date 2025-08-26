import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Heart, MessageCircle, Search, Filter, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const mockPosts = [
  {
    id: 1,
    title: "The Future of Web Development: What to Expect in 2024",
    excerpt: "Explore the latest trends, technologies, and frameworks that are shaping the future of web development. From AI integration to serverless architecture, discover what's coming next.",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      bio: "Senior Full Stack Developer"
    },
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    category: "Technology",
    imageUrl: "/placeholder.svg",
    likes: 234,
    comments: 45,
    featured: true
  },
  {
    id: 2,
    title: "Mastering React Server Components",
    excerpt: "A comprehensive guide to understanding and implementing React Server Components in your applications. Learn the benefits, challenges, and best practices.",
    author: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg",
      bio: "React Developer"
    },
    publishedAt: "2024-01-14",
    readTime: "6 min read",
    category: "React",
    imageUrl: "/placeholder.svg",
    likes: 189,
    comments: 32
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    excerpt: "Learn how to design and build APIs that can handle millions of requests. Best practices for performance, security, and maintainability.",
    author: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg",
      bio: "Backend Engineer"
    },
    publishedAt: "2024-01-13",
    readTime: "10 min read",
    category: "Backend",
    imageUrl: "/placeholder.svg",
    likes: 156,
    comments: 28
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox: When to Use What",
    excerpt: "Understanding the differences between CSS Grid and Flexbox, and knowing when to use each layout method for optimal results.",
    author: {
      name: "Michael Park",
      avatar: "/placeholder.svg",
      bio: "Frontend Designer"
    },
    publishedAt: "2024-01-12",
    readTime: "5 min read",
    category: "CSS",
    imageUrl: "/placeholder.svg",
    likes: 203,
    comments: 19
  },
  {
    id: 5,
    title: "Introduction to Machine Learning for Developers",
    excerpt: "Get started with machine learning concepts and practical implementations. Perfect for developers looking to add ML to their skillset.",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg",
      bio: "ML Engineer"
    },
    publishedAt: "2024-01-11",
    readTime: "12 min read",
    category: "AI",
    imageUrl: "/placeholder.svg",
    likes: 278,
    comments: 56
  },
  {
    id: 6,
    title: "The Art of Code Reviews",
    excerpt: "How to conduct effective code reviews that improve code quality and team collaboration. Tips for both reviewers and reviewees.",
    author: {
      name: "Lisa Wang",
      avatar: "/placeholder.svg",
      bio: "Senior Developer"
    },
    publishedAt: "2024-01-10",
    readTime: "7 min read",
    category: "Development",
    imageUrl: "/placeholder.svg",
    likes: 145,
    comments: 23
  }
];

const categories = ["All", "Technology", "React", "Backend", "CSS", "AI", "Development", "Design"];

export default function Blogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("latest");

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes;
      case "comments":
        return b.comments - a.comments;
      case "latest":
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Explore Articles</h1>
          <p className="text-muted-foreground text-lg">Discover insights, tutorials, and stories from our community</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles, authors, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="comments">Most Discussed</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex-1"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Showing {sortedPosts.length} articles</span>
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="ml-2">
                {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory("All")}
                  className="ml-1 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Articles Grid/List */}
        <div className={viewMode === "grid" 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-6"
        }>
          {sortedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {viewMode === "grid" ? (
                <div>
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.featured && <Badge className="bg-primary">Featured</Badge>}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground leading-tight hover:text-primary">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{post.author.name}</div>
                          <div className="text-xs text-muted-foreground">{post.author.bio}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {post.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              ) : (
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <CardContent className="md:w-2/3 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.featured && <Badge className="bg-primary">Featured</Badge>}
                      </div>
                      
                      <h3 className="text-2xl font-semibold text-foreground leading-tight hover:text-primary">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      
                      <p className="text-muted-foreground">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{post.author.name}</div>
                            <div className="text-sm text-muted-foreground">{post.author.bio}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>

        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No articles found matching your criteria</div>
            <Button onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {sortedPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
