/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * User and Authentication types
 */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: "admin" | "user";
  followers?: number;
  articles?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Author {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  followers?: number;
  articles?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  bio?: string;
}

export interface Comment {
  id: number;
  author: Author;
  content: string;
  publishedAt: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: number;
  views: number;
  featured?: boolean;
  status: "draft" | "published";
}

export interface CreateBlogRequest {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  publishType: "draft" | "publish";
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  id: number;
}

export interface CreateCommentRequest {
  blogId: number;
  content: string;
  parentId?: number; // for replies
}

export interface LikeBlogRequest {
  blogId: number;
}

export interface LikeCommentRequest {
  commentId: number;
}

/**
 * API Response types
 */
export interface BlogListResponse {
  blogs: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BlogDetailResponse {
  blog: BlogPost;
  comments: Comment[];
}

export interface CreateBlogResponse {
  blog: BlogPost;
  message: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * User Management Response types
 */
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminStatsResponse {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  recentUsers: User[];
  recentPosts: BlogPost[];
}
