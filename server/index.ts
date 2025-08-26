import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  toggleBlogLike,
  toggleBlogBookmark
} from "./routes/blogs";
import {
  getBlogComments,
  addComment,
  toggleCommentLike
} from "./routes/comments";
import {
  login,
  register,
  logout,
  getCurrentUser,
  createUser
} from "./routes/auth";
import {
  getAllUsers,
  getAdminStats,
  deleteUser,
  updateUserRole
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Blog API routes
  app.get("/api/blogs", getAllBlogs);
  app.get("/api/blogs/:id", getBlogById);
  app.post("/api/blogs", createBlog);
  app.put("/api/blogs/:id/like", toggleBlogLike);
  app.put("/api/blogs/:id/bookmark", toggleBlogBookmark);

  // Comment API routes
  app.get("/api/blogs/:blogId/comments", getBlogComments);
  app.post("/api/blogs/:blogId/comments", addComment);
  app.put("/api/comments/:id/like", toggleCommentLike);

  // Authentication API routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getCurrentUser);

  // Admin API routes
  app.get("/api/admin/users", getAllUsers);
  app.get("/api/admin/stats", getAdminStats);
  app.post("/api/admin/users", createUser);
  app.delete("/api/admin/users/:id", deleteUser);
  app.put("/api/admin/users/:id/role", updateUserRole);

  return app;
}
