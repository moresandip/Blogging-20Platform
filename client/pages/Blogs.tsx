import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Heart, MessageCircle, Search, Filter, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { BlogPost, BlogListResponse } from "@shared/api";

const categories = ["All", "Technology", "React", "Backend", "CSS", "AI", "Development", "Design"];

export default function Blogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("latest");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      params.append("sortBy", sortBy);
      
      const response = await fetch(`/api/blogs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      
      const data: BlogListResponse = await response.json();
      setPosts(data.blogs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blogs on component mount and when filters change
  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, searchTerm, sortBy]);

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
            <span>Showing {posts.length} articles</span>
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={fetchBlogs}>Try Again</Button>
          </div>
        )}

        {/* Articles Grid/List */}
        {!loading && !error && (
          <>
            <div className={viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-6"
            }>
              {posts.map((post) => (
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

            {posts.length === 0 && (
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
            {posts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
