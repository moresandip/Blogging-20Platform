import { RequestHandler } from "express";
import { User, UserListResponse, AdminStatsResponse } from "@shared/api";
import { mockUsers } from "./auth";

// Helper function to check admin authorization
const checkAdminAuth = (req: any): User | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const userId = parseInt(token.split("_")[1]);
  const user = mockUsers.find((u) => u.id === userId);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
};

// GET /api/admin/users - Get all users
export const getAllUsers: RequestHandler = (req, res) => {
  try {
    const admin = checkAdminAuth(req);
    if (!admin) {
      return res.status(403).json({
        error: "Admin access required",
        message: "You must be an admin to access this resource",
      });
    }

    const { page = 1, pageSize = 10, search, role } = req.query;

    let filteredUsers = [...mockUsers];

    // Filter by search term
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.bio.toLowerCase().includes(searchTerm),
      );
    }

    // Filter by role
    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    // Sort by creation date (newest first)
    filteredUsers.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Pagination
    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const startIndex = (pageNum - 1) * pageSizeNum;
    const endIndex = startIndex + pageSizeNum;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: UserListResponse = {
      users: paginatedUsers,
      total: filteredUsers.length,
      page: pageNum,
      pageSize: pageSizeNum,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/admin/stats - Get admin dashboard statistics
export const getAdminStats: RequestHandler = async (req, res) => {
  try {
    const admin = checkAdminAuth(req);
    if (!admin) {
      return res.status(403).json({
        error: "Admin access required",
        message: "You must be an admin to access this resource",
      });
    }

    // Import blogs data
    const { mockBlogs } = await import("./blogs");

    // Calculate stats
    const totalUsers = mockUsers.length;
    const totalPosts = mockBlogs.length;
    const totalComments = mockBlogs.reduce(
      (sum: number, blog: any) => sum + (blog.comments || 0),
      0,
    );
    const totalLikes = mockBlogs.reduce(
      (sum: number, blog: any) => sum + (blog.likes || 0),
      0,
    );

    // Get recent users (last 5)
    const recentUsers = [...mockUsers]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    // Get recent posts (last 5)
    const recentPosts = [...mockBlogs]
      .sort(
        (a: any, b: any) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, 5);

    const response: AdminStatsResponse = {
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
      recentUsers,
      recentPosts,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/admin/users/:id - Delete user
export const deleteUser: RequestHandler = (req, res) => {
  try {
    const admin = checkAdminAuth(req);
    if (!admin) {
      return res.status(403).json({
        error: "Admin access required",
        message: "You must be an admin to access this resource",
      });
    }

    const userId = parseInt(req.params.id);

    // Can't delete yourself
    if (admin.id === userId) {
      return res.status(400).json({
        error: "Cannot delete yourself",
        message: "You cannot delete your own account",
      });
    }

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        error: "User not found",
        message: "The specified user does not exist",
      });
    }

    mockUsers.splice(userIndex, 1);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/admin/users/:id/role - Update user role
export const updateUserRole: RequestHandler = (req, res) => {
  try {
    const admin = checkAdminAuth(req);
    if (!admin) {
      return res.status(403).json({
        error: "Admin access required",
        message: "You must be an admin to access this resource",
      });
    }

    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (!role || !["admin", "user"].includes(role)) {
      return res.status(400).json({
        error: "Invalid role",
        message: 'Role must be either "admin" or "user"',
      });
    }

    // Can't change your own role
    if (admin.id === userId) {
      return res.status(400).json({
        error: "Cannot change own role",
        message: "You cannot change your own role",
      });
    }

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The specified user does not exist",
      });
    }

    user.role = role;
    user.updatedAt = new Date().toISOString();

    res.json({
      user,
      message: `User role updated to ${role} successfully`,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
