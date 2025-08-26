import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  FileText,
  MessageCircle,
  Heart,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Shield,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  AdminStatsResponse,
  UserListResponse,
  CreateUserRequest,
} from "@shared/api";
import Header from "@/components/Header";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  // Create user form
  const [createUserForm, setCreateUserForm] = useState<CreateUserRequest>({
    name: "",
    email: "",
    password: "",
    role: "user",
    bio: "",
  });
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [createUserError, setCreateUserError] = useState<string | null>(null);

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error("Failed to fetch admin stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const params = new URLSearchParams();

      if (userSearch) params.append("search", userSearch);
      if (userRoleFilter !== "all") params.append("role", userRoleFilter);

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: UserListResponse = await response.json();
        setUsers(data.users);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    }
  };

  // Create new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserLoading(true);
    setCreateUserError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createUserForm),
      });

      if (response.ok) {
        setIsCreateUserOpen(false);
        setCreateUserForm({
          name: "",
          email: "",
          password: "",
          role: "user",
          bio: "",
        });
        await fetchUsers();
        await fetchStats();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create user");
      }
    } catch (err) {
      setCreateUserError(
        err instanceof Error ? err.message : "Failed to create user",
      );
    } finally {
      setCreateUserLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchUsers();
        await fetchStats();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete user");
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // Update user role
  const handleUpdateUserRole = async (
    userId: number,
    newRole: "admin" | "user",
  ) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update user role");
      }
    } catch (err) {
      alert("Failed to update user role");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers()]);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userSearch, userRoleFilter]);

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              Access denied. You must be an administrator to view this page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage users, posts, and platform settings
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Posts
                    </p>
                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Comments
                    </p>
                    <p className="text-2xl font-bold">{stats.totalComments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Likes
                    </p>
                    <p className="text-2xl font-bold">{stats.totalLikes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="posts">Post Management</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Dialog
                    open={isCreateUserOpen}
                    onOpenChange={setIsCreateUserOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                          Add a new user to the platform
                        </DialogDescription>
                      </DialogHeader>

                      {createUserError && (
                        <Alert variant="destructive">
                          <AlertDescription>{createUserError}</AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={createUserForm.name}
                              onChange={(e) =>
                                setCreateUserForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={createUserForm.email}
                              onChange={(e) =>
                                setCreateUserForm((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={createUserForm.password}
                              onChange={(e) =>
                                setCreateUserForm((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={createUserForm.role}
                              onValueChange={(value: "admin" | "user") =>
                                setCreateUserForm((prev) => ({
                                  ...prev,
                                  role: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio (Optional)</Label>
                          <Input
                            id="bio"
                            value={createUserForm.bio}
                            onChange={(e) =>
                              setCreateUserForm((prev) => ({
                                ...prev,
                                bio: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreateUserOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createUserLoading}>
                            {createUserLoading ? "Creating..." : "Create User"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={userRoleFilter}
                    onValueChange={setUserRoleFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userItem) => (
                      <TableRow key={userItem.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={userItem.avatar} />
                              <AvatarFallback>
                                {userItem.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{userItem.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {userItem.bio}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{userItem.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              userItem.role === "admin"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {userItem.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{userItem.articles || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {userItem.id !== user.id && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateUserRole(
                                      userItem.id,
                                      userItem.role === "admin"
                                        ? "user"
                                        : "admin",
                                    )
                                  }
                                >
                                  <Shield className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(userItem.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Post Management Tab */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Post Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Post management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {stats && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.recentUsers.map((recentUser) => (
                          <div
                            key={recentUser.id}
                            className="flex items-center space-x-3"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={recentUser.avatar} />
                              <AvatarFallback>
                                {recentUser.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">
                                {recentUser.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Joined{" "}
                                {new Date(
                                  recentUser.createdAt,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge
                              variant={
                                recentUser.role === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {recentUser.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.recentPosts.map((post) => (
                          <div key={post.id} className="space-y-2">
                            <div className="font-medium line-clamp-2">
                              {post.title}
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>by {post.author.name}</span>
                              <span>
                                {new Date(
                                  post.publishedAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
