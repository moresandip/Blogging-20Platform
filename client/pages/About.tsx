import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Target, 
  Users, 
  Heart, 
  Globe, 
  BookOpen, 
  PenTool, 
  MessageCircle,
  TrendingUp,
  Github,
  Twitter,
  Linkedin,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Former tech lead at major social platforms. Passionate about democratizing knowledge sharing.",
    avatar: "/placeholder.svg",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#"
    }
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    role: "Head of Engineering",
    bio: "Full-stack engineer with 10+ years building scalable platforms. React and Node.js enthusiast.",
    avatar: "/placeholder.svg",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#"
    }
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Head of Community",
    bio: "Community builder and content strategist. Helping writers find their voice and audience.",
    avatar: "/placeholder.svg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 4,
    name: "Michael Park",
    role: "Lead Designer",
    bio: "Product designer focused on creating beautiful, accessible experiences for writers and readers.",
    avatar: "/placeholder.svg",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  }
];

const features = [
  {
    icon: PenTool,
    title: "Rich Text Editor",
    description: "Write with our powerful editor featuring formatting, images, code blocks, and more."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Connect with writers and readers from around the world. Follow, comment, and collaborate."
  },
  {
    icon: MessageCircle,
    title: "Engaging Discussions",
    description: "Start meaningful conversations with comments, replies, and community feedback."
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    description: "Track your content performance with detailed analytics and reader insights."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Share your stories with a worldwide audience and discover diverse perspectives."
  },
  {
    icon: Heart,
    title: "Reader Engagement",
    description: "Build relationships with readers through likes, bookmarks, and follower systems."
  }
];

const stats = [
  { label: "Active Writers", value: "5,000+", icon: PenTool },
  { label: "Published Articles", value: "12,000+", icon: BookOpen },
  { label: "Monthly Readers", value: "100,000+", icon: Users },
  { label: "Countries Reached", value: "50+", icon: Globe }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              About BlogSpace
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're building the future of online publishing. A platform where writers can share their stories, 
              connect with readers, and build meaningful communities around shared knowledge and experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">
                  Join Our Community
                </Button>
              </Link>
              <Link to="/blogs">
                <Button size="lg" variant="outline">
                  Explore Stories
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              </div>
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe that everyone has a story worth telling. BlogSpace exists to democratize publishing 
                  and make it easier than ever for writers to share their knowledge, experiences, and perspectives 
                  with the world.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our platform combines the best of modern web technology with intuitive design to create 
                  an environment where creativity flourishes and meaningful connections are formed through 
                  the power of written word.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">By the Numbers</h2>
            <p className="text-muted-foreground text-lg">Growing every day with passionate writers and readers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Makes Us Different</h2>
            <p className="text-muted-foreground text-lg">Powerful features designed for modern writers and readers</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg">
              The passionate people building the future of online publishing
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-3">
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="text-muted-foreground hover:text-primary">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} className="text-muted-foreground hover:text-primary">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Community First</h3>
                  <p className="text-muted-foreground">
                    We believe in fostering genuine connections and supporting each other's growth as writers and thinkers.
                  </p>
                </div>
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Quality Content</h3>
                  <p className="text-muted-foreground">
                    We're committed to promoting thoughtful, well-crafted content that adds value to our readers' lives.
                  </p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Inclusive Platform</h3>
                  <p className="text-muted-foreground">
                    Everyone deserves a voice. We're building a platform that welcomes diverse perspectives and backgrounds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <Card>
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button size="lg" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Discord
                </Button>
              </div>
              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  Follow us on social media for updates and community highlights
                </p>
                <div className="flex justify-center space-x-6 mt-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
