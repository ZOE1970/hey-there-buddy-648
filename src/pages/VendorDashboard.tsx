import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Download, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const navigate = useNavigate();

  // Mock data - will be replaced with real API calls
  const submissions = [
    {
      id: "1",
      date: "2024-01-15",
      status: "approved",
      serviceName: "Cloud Storage Service",
      reviewDate: "2024-01-20"
    },
    {
      id: "2", 
      date: "2024-02-10",
      status: "pending",
      serviceName: "Email Marketing Platform",
      reviewDate: null
    },
    {
      id: "3",
      date: "2024-01-05",
      status: "rejected",
      serviceName: "Analytics Dashboard",
      reviewDate: "2024-01-12"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Vendor Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your compliance submissions</p>
            </div>
            <Button 
              onClick={() => navigate('/vendor/form')}
              className="bg-gradient-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Compliance Form
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
              <div className="text-2xl font-bold">3</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <div className="text-2xl font-bold text-success">1</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <div className="text-2xl font-bold text-warning">1</div>
            </CardHeader>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Submissions
            </CardTitle>
            <CardDescription>
              Track the status of your compliance form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.serviceName}</TableCell>
                    <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      {submission.reviewDate ? new Date(submission.reviewDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {submission.status === "approved" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/certificate/${submission.id}`)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Certificate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and helpful resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Start New Form</div>
                    <div className="text-sm text-muted-foreground">Submit a new compliance checklist</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Form Guidelines</div>
                    <div className="text-sm text-muted-foreground">Review compliance requirements</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;