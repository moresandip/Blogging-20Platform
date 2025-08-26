import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  TrendingUp, 
  Users, 
  FileText, 
  ArrowRight,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  Heart,
  Plane,
  UtensilsCrossed,
  Calendar,
  Clock
} from "lucide-react";
import Header from "@/components/Header";
import { BlogPost, BlogListResponse } from "@shared/api";

// Category configurations with icons and descriptions
const categoryConfigs = [
  {
    name: "Technology",
    icon: Code,
    description: "Latest trends in tech, programming, AI, and software development",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    emoji: "💻"
  },
  {
    name: "React",
    icon: Code,
    description: "React.js tutorials, best practices, and framework updates",
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
    emoji: "⚛️"
  },
  {
    name: "Backend",
    icon: Code,
    description: "Server-side development, APIs, databases, and architecture",
    color: "bg-green-500/10 text-green-600 border-green-200",
    emoji: "🔧"
  },
  {
    name: "CSS",
    icon: Palette,
    description: "Styling, animations, layouts, and modern CSS techniques",
    color: "bg-pink-500/10 text-pink-600 border-pink-200",
    emoji: "🎨"
  },
  {
    name: "AI",
    icon: Code,
    description: "Artificial Intelligence, machine learning, and automation",
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    emoji: "🤖"
  },
  {
    name: "Development",
    icon: Code,
    description: "General programming concepts, tools, and methodologies",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    emoji: "⚡"
  },
  {
    name: "Design",
    icon: Palette,
    description: "UI/UX design, visual design principles, and creative processes",
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
    emoji: "🎨"
  },
  {
    name: "Business",
    icon: Briefcase,
    description: "Entrepreneurship, startups, marketing, and business strategy",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    emoji: "💼"
  },
  {
    name: "Health",
    icon: Heart,
    description: "Wellness, fitness, mental health, and lifestyle tips",
    color: "bg-red-500/10 text-red-600 border-red-200",
    emoji: "🏥"
  },
  {
    name: "Travel",
    icon: Plane,
    description: "Travel guides, experiences, and cultural insights",
    color: "bg-sky-500/10 text-sky-600 border-sky-200",
    emoji: "✈️"
  },
  {
    name: "Food",
    icon: UtensilsCrossed,
    description: "Recipes, cooking tips, restaurant reviews, and food culture",
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    emoji: "🍽️"
  },
  {
    name: "Lifestyle",
    icon: Heart,
    description: "Personal stories, productivity, and life experiences",
    color: "bg-rose-500/10 text-rose-600 border-rose-200",
    emoji: "🌟"
  }
];

interface CategoryStats {
  name: string;
  count: number;
  recentPosts: BlogPost[];
  topAuthors: Array<{ name: string; avatar: string; posts: number }>;
}

export default function Categories() {
  const { category: selectedCategory } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch category statistics and posts
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts from all categories to build statistics
        const response = await fetch('/api/blogs?pageSize=100');
        if (response.ok) {
          const data: BlogListResponse = await response.json();
          const posts = data.blogs;

          // Build category statistics
          const stats: CategoryStats[] = categoryConfigs.map(categoryConfig => {
            const categoryPosts = posts.filter(post => post.category === categoryConfig.name);
            
            // Get recent posts for this category
            const recentPosts = categoryPosts
              .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              .slice(0, 3);

            // Get top authors for this category
            const authorMap = new Map();
            categoryPosts.forEach(post => {
              const authorName = post.author.name;
              if (authorMap.has(authorName)) {
                authorMap.set(authorName, {
                  ...authorMap.get(authorName),
                  posts: authorMap.get(authorName).posts + 1
                });
              } else {
                authorMap.set(authorName, {
                  name: authorName,
                  avatar: post.author.avatar,
                  posts: 1
                });
              }
            });

            const topAuthors = Array.from(authorMap.values())
              .sort((a, b) => b.posts - a.posts)
              .slice(0, 3);

            return {
              name: categoryConfig.name,
              count: categoryPosts.length,
              recentPosts,
              topAuthors
            };
          });

          setCategoryStats(stats);

          // Set featured posts (popular posts from all categories)
          const featured = posts
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 6);
          setFeaturedPosts(featured);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  // Filter categories based on search
  const filteredCategories = categoryConfigs.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  // If specific category is selected, show category detail view
  if (selectedCategory) {
    const categoryConfig = categoryConfigs.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
    const categoryData = categoryStats.find(s => s.name.toLowerCase() === selectedCategory.toLowerCase());

    if (!categoryConfig || !categoryData) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
              <Link to="/categories">
                <Button>Back to Categories</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <Link to="/categories" className="text-muted-foreground hover:text-foreground mb-4 inline-block">
              ← Back to Categories
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${categoryConfig.color}`}>
                {categoryConfig.emoji}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">{categoryConfig.name}</h1>
                <p className="text-muted-foreground text-lg">{categoryConfig.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {categoryData.count} articles
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {categoryData.topAuthors.length} active writers
              </span>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Articles</h2>
              <div className="space-y-4">
                {categoryData.recentPosts.map(post => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        <Link to={`/blog/${post.id}`} className="hover:text-primary">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{post.author.name}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <Link to={`/blogs?category=${categoryConfig.name}`}>
                  <Button className="w-full">
                    View All {categoryConfig.name} Articles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Top Authors */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Top Writers</h2>
              <div className="space-y-4">
                {categoryData.topAuthors.map((author, index) => (
                  <Card key={author.name}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={author.avatar} />
                            <AvatarFallback>{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{author.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {author.posts} article{author.posts !== 1 ? 's' : ''} published
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main categories listing view
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Explore Categories</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover articles organized by topics you care about. From technology and design to lifestyle and business.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCategories.map((category) => {
            const stats = categoryStats.find(s => s.name === category.name);
            return (
              <Link key={category.name} to={`/category/${category.name.toLowerCase()}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${category.color}`}>
                        {category.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {stats?.count || 0} articles
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    {stats && stats.recentPosts.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Recent Articles
                        </div>
                        {stats.recentPosts.slice(0, 2).map(post => (
                          <div key={post.id} className="text-sm">
                            <div className="font-medium text-foreground line-clamp-1">{post.title}</div>
                            <div className="text-xs text-muted-foreground">by {post.author.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Featured Articles</h2>
                <p className="text-muted-foreground">Popular content across all categories</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map(post => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      <Link to={`/blog/${post.id}`} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{post.author.name}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
