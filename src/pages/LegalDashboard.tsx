import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download,
  Filter,
  X,
  LogOut,
  Scale,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useAuth } from '@/hooks/useAuth';

const LegalDashboard = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { submissions, loading, error } = useSubmissions();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Generate consistent vendor slug for navigation
  const generateVendorSlug = (submission) => {
    // Create slug from vendor name and use first 8 characters of submission ID
    const vendorSlug = submission.vendor_name.toLowerCase().replace(/\s+/g, '-');
    const idPrefix = submission.id.split('-')[0]; // Get first part of UUID
    return `${vendorSlug}-${idPrefix}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "conditional":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Conditional</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    const matchesSearch = submission.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const approvedCount = submissions.filter(s => s.status === "approved").length;
  const rejectedCount = submissions.filter(s => s.status === "rejected").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">Error loading submissions: {error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                Welcome {user?.role === 'superadmin' ? 'Data Protection Officer' : (user?.first_name || user?.email || 'User')}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Review vendor compliance submissions for legal assessment</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," 
                    + "Vendor,Service,Status,Risk Level,Submitted,Reviewed\n"
                    + submissions.map(s => 
                        `"${s.vendor_name}","${s.service_name}","${s.status}","${s.risk_level}","${new Date(s.created_at).toLocaleDateString()}","${s.reviewed_at ? new Date(s.reviewed_at).toLocaleDateString() : 'N/A'}"`
                      ).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `legal_review_export_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button 
                variant="outline" 
                className="sm:hidden"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                {isFiltersOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Legal Notice Card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-lg">
              <FileText className="h-5 w-5" />
              Legal Review Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-blue-800 text-sm">
              You have read-only access to vendor compliance submissions for legal review purposes. 
              Contact the admin team for approval actions.
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards - Mobile responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-xs font-medium text-gray-600">Total Submissions</CardTitle>
              <div className="text-xl font-bold text-gray-900">{submissions.length}</div>
            </CardHeader>
          </Card>
          <Card className="bg-white border">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-xs font-medium text-gray-600">Pending Review</CardTitle>
              <div className="text-xl font-bold text-yellow-600">{pendingCount}</div>
            </CardHeader>
          </Card>
          <Card className="bg-white border">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-xs font-medium text-gray-600">Approved</CardTitle>
              <div className="text-xl font-bold text-green-600">{approvedCount}</div>
            </CardHeader>
          </Card>
          <Card className="bg-white border">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-xs font-medium text-gray-600">Rejected</CardTitle>
              <div className="text-xl font-bold text-red-600">{rejectedCount}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters and Search - Mobile responsive */}
        <Card className="mb-6 bg-white border">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg">Filter Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className={`flex flex-col gap-4 ${isFiltersOpen ? 'block' : 'hidden sm:flex sm:flex-row'}`}>
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search vendors or services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="conditional">Conditional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table - Mobile responsive */}
        <Card className="bg-white border mb-6">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Compliance Submissions</CardTitle>
            <CardDescription className="text-gray-600">
              Legal review of vendor data protection compliance forms (Read-only access)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Service</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Risk</TableHead>
                    <TableHead className="font-semibold">Review Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{submission.vendor_name}</TableCell>
                      <TableCell className="text-sm">{submission.service_name}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>{getRiskBadge(submission.risk_level)}</TableCell>
                      <TableCell className="text-sm">
                        {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/legal/review/${generateVendorSlug(submission)}`)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards - 2x2 Grid */}
            <div className="md:hidden p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} className="bg-gray-50 border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">{submission.vendor_name}</h3>
                            <p className="text-xs text-gray-600 truncate">{submission.service_name}</p>
                          </div>
                          {getStatusBadge(submission.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600 block">Submitted:</span>
                            <span className="font-medium">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Risk:</span>
                            <span>{getRiskBadge(submission.risk_level)}</span>
                          </div>
                        </div>

                        {submission.reviewed_at && (
                          <div className="text-xs">
                            <span className="text-gray-600">Reviewed:</span>
                            <span className="font-medium block">
                              {new Date(submission.reviewed_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/legal/review/${generateVendorSlug(submission)}`)}
                          className="w-full flex items-center gap-2 text-xs"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No submissions found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* High Risk Submissions - Legal Focus */}
        {submissions.filter(s => s.risk_level === "high").length > 0 && (
          <div className="mt-6">
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <AlertTriangle className="h-5 w-5" />
                  High-Risk Submissions
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Submissions requiring legal attention due to high risk classification
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {submissions
                    .filter(s => s.risk_level === "high")
                    .map(submission => (
                      <div key={submission.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-amber-200 rounded-lg bg-white">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="font-medium text-gray-900">{submission.vendor_name}</div>
                          <div className="text-sm text-gray-600">{submission.service_name}</div>
                          <div className="text-xs text-amber-700 mt-1">
                            Status: {submission.status} • Submitted: {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {getRiskBadge(submission.risk_level)}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 sm:flex-none border-amber-300 text-amber-700 hover:bg-amber-50"
                            onClick={() => navigate(`/legal/review/${generateVendorSlug(submission)}`)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalDashboard;