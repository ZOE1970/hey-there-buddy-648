import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Download, Clock, CheckCircle, XCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const VendorDashboard = () => {
  const navigate = useNavigate();

  // Logout function - clears session and redirects to landing page
  const handleLogout = async () => {
    try {
      // Clear the Supabase session first
      await supabase.auth.signOut();
      console.log("User logged out");
      // Then navigate to landing page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to landing page
      navigate('/');
    }
  };

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          navigate('/login');
          return;
        }

        console.log('Fetching submissions for user:', user.email);

        const { data, error } = await supabase
          .from('compliance_submissions')
          .select('*')
          .eq('vendor_email', user.email)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Fetched submissions:', data);
        setSubmissions(data || []);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: "Error",
          description: "Failed to load your submissions. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();

    // Listen for changes in submissions to auto-refresh
    const channel = supabase
      .channel('vendor-submissions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'compliance_submissions' 
        }, 
        () => {
          console.log('Submission updated, refetching...');
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const handleViewSubmission = (submission) => {
    // For now, show a detailed view in a toast/modal
    // You can later implement a proper view page
    toast({
      title: `${submission.service_name} Details`,
      description: `Status: ${submission.status} | Submitted: ${new Date(submission.created_at).toLocaleDateString()}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success text-success-foreground text-xs"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="text-xs"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="text-xs"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "conditional":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">Conditional</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Clean on mobile, buttons on desktop */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Vendor Dashboard</h1>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Manage your compliance submissions</p>
            </div>
            {/* Desktop buttons */}
            <div className="hidden sm:flex gap-3">
              <Button 
                onClick={() => navigate('/vendor/form')}
                className="bg-gradient-primary text-sm px-3 py-2 h-9"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Form
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-sm px-3 py-2 h-9"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats Cards - More compact */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2 pt-3 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total</CardTitle>
              <div className="text-lg sm:text-2xl font-bold">{submissions.length}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2 pt-3 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <div className="text-lg sm:text-2xl font-bold text-success">
                {submissions.filter(s => s.status === 'approved').length}
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2 pt-3 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <div className="text-lg sm:text-2xl font-bold text-warning">
                {submissions.filter(s => s.status === 'pending').length}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Submissions Table - Mobile optimized */}
        <Card>
          <CardHeader className="pb-3 pt-4 px-3 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Your Submissions
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Track your compliance form submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="mb-4">No submissions yet</div>
                  <Button 
                    onClick={() => navigate('/vendor/form')}
                    className="bg-gradient-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Form
                  </Button>
                </div>
              ) : (
                submissions.map((submission) => (
                  <div key={submission.id} className="border-b last:border-b-0 p-3 mx-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm truncate pr-2">{submission.service_name}</h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      <div>Submitted: {new Date(submission.created_at).toLocaleDateString()}</div>
                      {submission.reviewed_at && (
                        <div>Reviewed: {new Date(submission.reviewed_at).toLocaleDateString()}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs px-2 py-1 h-6"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {submission.status === "approved" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/certificate/${submission.id}`)}
                          className="text-xs px-2 py-1 h-6"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Cert
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Service Name</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Submission Date</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Review Date</TableHead>
                    <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Loading submissions...
                      </TableCell>
                    </TableRow>
                  ) : submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <div className="space-y-4">
                          <div>No submissions yet</div>
                          <Button 
                            onClick={() => navigate('/vendor/form')}
                            className="bg-gradient-primary"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Form
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{submission.service_name}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs sm:text-sm">{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs sm:text-sm">
                          {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 py-1 h-7"
                              onClick={() => handleViewSubmission(submission)}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {submission.status === "approved" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/certificate/${submission.id}`)}
                                className="text-xs px-2 py-1 h-7"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Certificate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Compact */}
        <div className="mt-6 sm:mt-8">
          <Card>
            <CardHeader className="pb-3 pt-4 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Common tasks and resources</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-3 sm:p-4 justify-start text-left"
                  onClick={() => navigate('/vendor/form')}
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-xs sm:text-sm">Start New Form</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">Submit a new compliance checklist</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-3 sm:p-4 justify-start text-left">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-xs sm:text-sm">Form Guidelines</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">Review compliance requirements</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Action Bar - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg sm:hidden z-50">
        <div className="container mx-auto px-3 py-3">
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/vendor/form')}
              className="bg-gradient-primary flex-1 text-sm px-4 py-3 h-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Compliance Form
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="px-4 py-3 h-auto"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add padding to bottom on mobile to account for fixed action bar */}
      <div className="h-20 sm:hidden"></div>
    </div>
  );
};

export default VendorDashboard;