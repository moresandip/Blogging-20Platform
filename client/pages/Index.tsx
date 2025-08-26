import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { BlogPost, BlogListResponse } from "@shared/api";

const featuredPost = {
  id: 1,
  title: "The Future of Web Development: What to Expect in 2024",
  excerpt:
    "Explore the latest trends, technologies, and frameworks that are shaping the future of web development. From AI integration to serverless architecture...",
  author: {
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    bio: "Senior Full Stack Developer",
  },
  publishedAt: "2024-01-15",
  readTime: "8 min read",
  category: "Technology",
  imageUrl: "/placeholder.svg",
  likes: 234,
  comments: 45,
};

const trendingPosts = [
  {
    id: 2,
    title: "Mastering React Server Components",
    author: "Alex Rodriguez",
    readTime: "6 min read",
    category: "React",
    likes: 189,
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    author: "Emma Thompson",
    readTime: "10 min read",
    category: "Backend",
    likes: 156,
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox: When to Use What",
    author: "Michael Park",
    readTime: "5 min read",
    category: "CSS",
    likes: 203,
  },
];

const categories = [
  { name: "Technology", count: 1247, icon: "💻" },
  { name: "Design", count: 892, icon: "🎨" },
  { name: "Business", count: 654, icon: "💼" },
  { name: "Health", count: 543, icon: "🏥" },
  { name: "Travel", count: 432, icon: "✈️" },
  { name: "Food", count: 321, icon: "🍽️" },
];

export default function Index() {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Fetch featured and trending posts
    const fetchFeaturedContent = async () => {
      try {
        const response = await fetch("/api/blogs?sortBy=popular&pageSize=4");
        if (response.ok) {
          const data: BlogListResponse = await response.json();
          if (data.blogs.length > 0) {
            setFeaturedPost(data.blogs[0]);
            setTrendingPosts(data.blogs.slice(1));
          }
        }
      } catch (error) {
        console.error("Error fetching featured content:", error);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Discover Stories,
              <span className="text-primary block">Share Ideas</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a community of writers and readers passionate about sharing
              knowledge, experiences, and insights that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/blogs">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Reading
                </Button>
              </Link>
              <Link to="/create">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Start Writing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">12K+</div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">5K+</div>
              <div className="text-sm text-muted-foreground">Writers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">100K+</div>
              <div className="text-sm text-muted-foreground">Monthly Reads</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Featured Story
            </h2>
            <p className="text-muted-foreground">
              Hand-picked by our editorial team
            </p>
          </div>

          {featuredPost ? (
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <CardContent className="md:w-1/2 p-8">
                  <div className="space-y-4">
                    <Badge variant="secondary">{featuredPost.category}</Badge>
                    <h3 className="text-2xl font-bold text-foreground leading-tight">
                      {featuredPost.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={featuredPost.author.avatar} />
                        <AvatarFallback>
                          {featuredPost.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {featuredPost.author.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {featuredPost.author.bio}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(
                          featuredPost.publishedAt,
                        ).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>

                    <Link to={`/blog/${featuredPost.id}`}>
                      <Button className="w-full md:w-auto">
                        Read Full Story
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading featured story...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Posts */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Trending Now
            </h2>
            <p className="text-muted-foreground">
              Most popular articles this week
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {trendingPosts.length > 0
              ? trendingPosts.map((post, index) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <Card className="hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{post.category}</Badge>
                            <span className="text-2xl font-bold text-primary">
                              #{index + 1}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground leading-tight">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>by {post.author.name}</span>
                            <span>{post.readTime}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            {post.likes} likes
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              : Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
                          <div className="h-8 bg-muted rounded animate-pulse w-8"></div>
                        </div>
                        <div className="h-12 bg-muted rounded animate-pulse"></div>
                        <div className="flex items-center justify-between">
                          <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                          <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                        </div>
                        <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/blogs">
              <Button variant="outline" size="lg">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Find content that interests you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} articles
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of writers who are already sharing their knowledge
            and experiences.
          </p>
          <Link to="/create">
            <Button size="lg" variant="secondary">
              Start Writing Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">BlogSpace</span>
              </div>
              <p className="text-muted-foreground">
                A platform for sharing knowledge and connecting with like-minded
                individuals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/blogs" className="hover:text-foreground">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/create" className="hover:text-foreground">
                    Write
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/guidelines" className="hover:text-foreground">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="hover:text-foreground">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 BlogSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
