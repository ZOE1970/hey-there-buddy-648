import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  UserCheck, 
  Shield, 
  Trash2,
  User as UserIcon,
  Mail,
  Building,
  UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "@/hooks/use-toast";
import { AddUserModal } from "@/components/AddUserModal";
import { supabase } from "@/integrations/supabase/client";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const { users, userStats, loading, error, deleteUser, refetch } = useUsers();

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      await deleteUser(userId);
      toast({
        title: "User Deleted",
        description: `User ${userEmail} has been successfully deleted.`,
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: `User ${userEmail} role changed to ${newRole}.`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Shield className="h-3 w-3 mr-1" />Super Admin</Badge>;
      case "limited_admin":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case "legal":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200"><UserCheck className="h-3 w-3 mr-1" />Legal</Badge>;
      case "vendor":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><Building className="h-3 w-3 mr-1" />Vendor</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error loading users: {error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
              </div>
            </div>
            <Button onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card border">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
              <div className="text-2xl font-bold text-foreground">{userStats?.total_users || users.length}</div>
            </CardHeader>
          </Card>
          <Card className="bg-card border">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Building className="h-4 w-4" />
                Vendors
              </CardTitle>
              <div className="text-2xl font-bold text-green-600">{userStats?.vendor_count || users.filter(u => u.role === 'vendor').length}</div>
            </CardHeader>
          </Card>
          <Card className="bg-card border col-span-2 lg:col-span-1">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admins
              </CardTitle>
              <div className="text-2xl font-bold text-blue-600">{userStats?.admin_count || users.filter(u => u.role === 'superadmin').length}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-card border">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg">Search Users</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-muted/50 border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-card border">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">All Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Joined</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : user.email.split('@')[0]
                              }
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value, user.email)}>
                          <SelectTrigger className="w-32">
                            <SelectValue>{getRoleBadge(user.role)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="limited_admin">Admin</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            {user.role === 'superadmin' && <SelectItem value="superadmin">Super Admin</SelectItem>}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm">{user.company || '—'}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.role !== 'superadmin' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.email}? This action cannot be undone and will remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4">
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="bg-muted/30 border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">
                                {user.first_name && user.last_name 
                                  ? `${user.first_name} ${user.last_name}`
                                  : user.email.split('@')[0]
                                }
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{user.email}</span>
                              </div>
                            </div>
                          </div>
                          {getRoleBadge(user.role)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">Company:</span>
                            <span className="font-medium">{user.company || '—'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Joined:</span>
                            <span className="font-medium">
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {user.role !== 'superadmin' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete User
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.email}? This action cannot be undone and will remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p>No users found matching your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={refetch}
      />
    </div>
  );
};

export default UserManagement;