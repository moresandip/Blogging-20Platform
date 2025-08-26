import { RequestHandler } from "express";
import { 
  BlogPost, 
  BlogListResponse, 
  BlogDetailResponse, 
  CreateBlogRequest, 
  CreateBlogResponse,
  Author 
} from "@shared/api";

// Mock data - replace with actual database operations
const mockAuthor: Author = {
  id: 1,
  name: "Current User",
  avatar: "/placeholder.svg",
  bio: "Passionate writer and developer",
  followers: 150,
  articles: 12
};

let mockBlogs: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development: What to Expect in 2024",
    excerpt: "Explore the latest trends, technologies, and frameworks that are shaping the future of web development. From AI integration to serverless architecture, discover what's coming next.",
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
    views: 3200,
    featured: true,
    status: "published"
  },
  {
    id: 2,
    title: "Mastering React Server Components",
    excerpt: "A comprehensive guide to understanding and implementing React Server Components in your applications. Learn the benefits, challenges, and best practices.",
    content: "<p>Detailed content about React Server Components...</p>",
    author: {
      id: 2,
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg",
      bio: "React Developer"
    },
    publishedAt: "2024-01-14T09:15:00Z",
    readTime: "6 min read",
    category: "React",
    tags: ["React", "SSR", "Performance"],
    imageUrl: "/placeholder.svg",
    likes: 189,
    isLiked: false,
    isBookmarked: false,
    comments: 32,
    views: 2100,
    status: "published"
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    excerpt: "Learn how to design and build APIs that can handle millions of requests. Best practices for performance, security, and maintainability.",
    content: "<p>Detailed content about Node.js APIs...</p>",
    author: {
      id: 3,
      name: "Emma Thompson",
      avatar: "/placeholder.svg",
      bio: "Backend Engineer"
    },
    publishedAt: "2024-01-13T14:30:00Z",
    readTime: "10 min read",
    category: "Backend",
    tags: ["Node.js", "API", "Scalability"],
    imageUrl: "/placeholder.svg",
    likes: 156,
    isLiked: false,
    isBookmarked: false,
    comments: 28,
    views: 1800,
    status: "published"
  }
];

let nextId = 4;

// Calculate read time based on content
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

// GET /api/blogs - List all blogs with filtering and pagination
export const getAllBlogs: RequestHandler = (req, res) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      category, 
      search, 
      sortBy = 'latest' 
    } = req.query;

    let filteredBlogs = mockBlogs.filter(blog => blog.status === 'published');

    // Filter by category
    if (category && category !== 'All') {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.excerpt.toLowerCase().includes(searchTerm) ||
        blog.author.name.toLowerCase().includes(searchTerm) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort blogs
    filteredBlogs.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'comments':
          return b.comments - a.comments;
        case 'latest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    // Pagination
    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const startIndex = (pageNum - 1) * pageSizeNum;
    const endIndex = startIndex + pageSizeNum;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    const response: BlogListResponse = {
      blogs: paginatedBlogs,
      total: filteredBlogs.length,
      page: pageNum,
      pageSize: pageSizeNum
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/blogs/:id - Get a specific blog post
export const getBlogById: RequestHandler = (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    const blog = mockBlogs.find(b => b.id === blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment view count
    blog.views += 1;

    const response: BlogDetailResponse = {
      blog,
      comments: [] // Comments will be handled separately
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/blogs - Create a new blog post
export const createBlog: RequestHandler = (req, res) => {
  try {
    const blogData: CreateBlogRequest = req.body;

    if (!blogData.title || !blogData.content || !blogData.category) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Title, content, and category are required'
      });
    }

    const newBlog: BlogPost = {
      id: nextId++,
      title: blogData.title,
      excerpt: blogData.excerpt || blogData.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      content: blogData.content,
      author: mockAuthor,
      publishedAt: blogData.publishType === 'publish' ? new Date().toISOString() : '',
      readTime: calculateReadTime(blogData.content),
      category: blogData.category,
      tags: blogData.tags || [],
      imageUrl: blogData.imageUrl || '/placeholder.svg',
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      comments: 0,
      views: 0,
      status: blogData.publishType === 'publish' ? 'published' : 'draft'
    };

    mockBlogs.unshift(newBlog);

    const response: CreateBlogResponse = {
      blog: newBlog,
      message: blogData.publishType === 'publish' ? 'Blog published successfully!' : 'Blog saved as draft!'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/blogs/:id/like - Toggle like on a blog post
export const toggleBlogLike: RequestHandler = (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    const blog = mockBlogs.find(b => b.id === blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    blog.isLiked = !blog.isLiked;
    blog.likes += blog.isLiked ? 1 : -1;

    res.json({ 
      isLiked: blog.isLiked, 
      likes: blog.likes,
      message: blog.isLiked ? 'Blog liked!' : 'Blog unliked!'
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/blogs/:id/bookmark - Toggle bookmark on a blog post
export const toggleBlogBookmark: RequestHandler = (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    const blog = mockBlogs.find(b => b.id === blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    blog.isBookmarked = !blog.isBookmarked;

    res.json({ 
      isBookmarked: blog.isBookmarked,
      message: blog.isBookmarked ? 'Blog bookmarked!' : 'Bookmark removed!'
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
