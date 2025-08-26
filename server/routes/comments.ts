import { RequestHandler } from "express";
import { Comment, CreateCommentRequest } from "@shared/api";

// Mock comments data
let mockComments: Comment[] = [
  {
    id: 1,
    author: {
      id: 2,
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg",
      bio: "React Developer"
    },
    content: "Great article! I'm particularly excited about Server Components. The performance implications are huge.",
    publishedAt: "2024-01-15T16:45:00Z",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 11,
        author: {
          id: 1,
          name: "Sarah Chen",
          avatar: "/placeholder.svg",
          bio: "Senior Full Stack Developer"
        },
        content: "Thanks Alex! Yes, Server Components are game-changing. I've seen 40-50% bundle size reductions in some cases.",
        publishedAt: "2024-01-15T17:15:00Z",
        likes: 8,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: 2,
    author: {
      id: 3,
      name: "Emma Thompson",
      avatar: "/placeholder.svg",
      bio: "Backend Engineer"
    },
    content: "The AI integration section resonates with me. I've been using Copilot for 6 months now and my productivity has increased significantly.",
    publishedAt: "2024-01-15T18:20:00Z",
    likes: 15,
    isLiked: false,
    replies: []
  },
  {
    id: 3,
    author: {
      id: 4,
      name: "Michael Park",
      avatar: "/placeholder.svg",
      bio: "Frontend Designer"
    },
    content: "Edge computing is definitely the future. The latency improvements are noticeable, especially for global applications.",
    publishedAt: "2024-01-16T09:10:00Z",
    likes: 7,
    isLiked: false,
    replies: []
  }
];

let nextCommentId = 12;

// GET /api/blogs/:blogId/comments - Get comments for a specific blog post
export const getBlogComments: RequestHandler = (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId);
    
    // In a real app, filter comments by blogId
    // For now, return all mock comments
    const comments = mockComments;

    res.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/blogs/:blogId/comments - Add a comment to a blog post
export const addComment: RequestHandler = (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId);
    const commentData: CreateCommentRequest = req.body;

    if (!commentData.content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Comment content is required'
      });
    }

    const newComment: Comment = {
      id: nextCommentId++,
      author: {
        id: 999, // Current user ID
        name: "Current User",
        avatar: "/placeholder.svg",
        bio: "Blog Reader"
      },
      content: commentData.content,
      publishedAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    // If it's a reply to another comment
    if (commentData.parentId) {
      const parentComment = findCommentById(commentData.parentId);
      if (parentComment) {
        parentComment.replies.push(newComment);
      } else {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    } else {
      // Top-level comment
      mockComments.push(newComment);
    }

    res.status(201).json({ 
      comment: newComment,
      message: 'Comment added successfully!'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/comments/:id/like - Toggle like on a comment
export const toggleCommentLike: RequestHandler = (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const comment = findCommentById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.isLiked = !comment.isLiked;
    comment.likes += comment.isLiked ? 1 : -1;

    res.json({ 
      isLiked: comment.isLiked, 
      likes: comment.likes,
      message: comment.isLiked ? 'Comment liked!' : 'Comment unliked!'
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to find comment by ID (including replies)
function findCommentById(id: number): Comment | null {
  for (const comment of mockComments) {
    if (comment.id === id) {
      return comment;
    }
    
    // Check replies
    const reply = findInReplies(comment.replies, id);
    if (reply) {
      return reply;
    }
  }
  return null;
}

function findInReplies(replies: Comment[], id: number): Comment | null {
  for (const reply of replies) {
    if (reply.id === id) {
      return reply;
    }
    
    // Recursively check nested replies
    const nestedReply = findInReplies(reply.replies, id);
    if (nestedReply) {
      return nestedReply;
    }
  }
  return null;
}
