import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - will be replaced with real API calls
  const submissions = [
    {
      id: "1",
      vendorName: "TechCorp Solutions",
      serviceName: "Cloud Storage Service", 
      submissionDate: "2024-01-15",
      status: "pending",
      riskLevel: "medium",
      reviewDate: null
    },
    {
      id: "2",
      vendorName: "DataFlow Inc",
      serviceName: "Email Marketing Platform",
      submissionDate: "2024-02-10", 
      status: "approved",
      riskLevel: "low",
      reviewDate: "2024-02-15"
    },
    {
      id: "3",
      vendorName: "Analytics Pro",
      serviceName: "Analytics Dashboard",
      submissionDate: "2024-01-05",
      status: "rejected",
      riskLevel: "high", 
      reviewDate: "2024-01-12"
    },
    {
      id: "4",
      vendorName: "SecureCloud Ltd",
      serviceName: "File Sharing Platform",
      submissionDate: "2024-02-20",
      status: "pending",
      riskLevel: "low",
      reviewDate: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge variant="outline" className="text-success border-success">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-warning border-warning">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="text-destructive border-destructive">High</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    const matchesSearch = submission.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const approvedCount = submissions.filter(s => s.status === "approved").length;
  const rejectedCount = submissions.filter(s => s.status === "rejected").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Review and manage vendor compliance submissions</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
              <div className="text-2xl font-bold">{submissions.length}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <div className="text-2xl font-bold text-warning">{pendingCount}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <div className="text-2xl font-bold text-success">{approvedCount}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by vendor or service name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Submissions</CardTitle>
            <CardDescription>
              Review and manage vendor data protection compliance forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{submission.vendorName}</TableCell>
                    <TableCell>{submission.serviceName}</TableCell>
                    <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>{getRiskBadge(submission.riskLevel)}</TableCell>
                    <TableCell>
                      {submission.reviewDate ? new Date(submission.reviewDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/review/${submission.id}`)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Priority Queue */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Priority Queue
              </CardTitle>
              <CardDescription>Submissions requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions
                  .filter(s => s.status === "pending" && s.riskLevel === "high")
                  .map(submission => (
                    <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5 border-destructive/20">
                      <div>
                        <div className="font-medium">{submission.vendorName}</div>
                        <div className="text-sm text-muted-foreground">{submission.serviceName}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRiskBadge(submission.riskLevel)}
                        <Button variant="outline" size="sm">
                          Review Now
                        </Button>
                      </div>
                    </div>
                  ))}
                {submissions.filter(s => s.status === "pending" && s.riskLevel === "high").length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No high-priority submissions pending.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;