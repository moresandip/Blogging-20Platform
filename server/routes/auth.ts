import { RequestHandler } from "express";
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  CreateUserRequest
} from "@shared/api";

// Mock user data - replace with actual database
let mockUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@blogspace.com",
    avatar: "/placeholder.svg",
    bio: "Platform Administrator",
    role: "admin",
    followers: 0,
    articles: 0,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "/placeholder.svg",
    bio: "Senior Full Stack Developer",
    role: "user",
    followers: 1250,
    articles: 45,
    createdAt: "2024-01-05T00:00:00Z"
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    email: "alex@example.com",
    avatar: "/placeholder.svg",
    bio: "React Developer",
    role: "user",
    followers: 890,
    articles: 23,
    createdAt: "2024-01-10T00:00:00Z"
  }
];

let nextUserId = 4;

// Mock password storage (in real app, use proper hashing)
const mockPasswords: Record<string, string> = {
  "admin@blogspace.com": "admin123",
  "sarah@example.com": "password123",
  "alex@example.com": "password123"
};

// Generate mock JWT token (in real app, use proper JWT library)
const generateToken = (user: User): string => {
  return `token_${user.id}_${Date.now()}`;
};

// POST /api/auth/login - User login
export const login: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password
    if (mockPasswords[email] !== password) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const token = generateToken(user);
    const response: AuthResponse = {
      user,
      token,
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/register - User registration
export const register: RequestHandler = (req, res) => {
  try {
    const { name, email, password, bio }: RegisterRequest = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Create new user
    const newUser: User = {
      id: nextUserId++,
      name,
      email,
      avatar: "/placeholder.svg",
      bio: bio || "New blogger",
      role: "user",
      followers: 0,
      articles: 0,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    mockPasswords[email] = password;

    const token = generateToken(newUser);
    const response: AuthResponse = {
      user: newUser,
      token,
      message: 'Registration successful'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/logout - User logout
export const logout: RequestHandler = (req, res) => {
  try {
    // In a real app, you would invalidate the token here
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/auth/me - Get current user (verify token)
export const getCurrentUser: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization token is required'
      });
    }

    const token = authHeader.substring(7);
    
    // In a real app, verify JWT token here
    // For now, extract user ID from mock token
    const userId = parseInt(token.split('_')[1]);
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin only: POST /api/admin/users - Create new user
export const createUser: RequestHandler = (req, res) => {
  try {
    // Check if requester is admin (simplified check)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const userId = parseInt(token.split('_')[1]);
    const currentUser = mockUsers.find(u => u.id === userId);

    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, email, password, role, bio }: CreateUserRequest = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, password, and role are required'
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Create new user
    const newUser: User = {
      id: nextUserId++,
      name,
      email,
      avatar: "/placeholder.svg",
      bio: bio || "New user",
      role,
      followers: 0,
      articles: 0,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    mockPasswords[email] = password;

    res.status(201).json({
      user: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export users for use in other modules
export { mockUsers };
