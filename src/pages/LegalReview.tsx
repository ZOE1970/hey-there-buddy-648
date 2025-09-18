import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Download, Scale, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Submission } from "@/hooks/useSubmissions";

const LegalReview = () => {
  const navigate = useNavigate();
  const { vendorSlug } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!vendorSlug) {
        toast({
          title: "Error",
          description: "No submission identifier provided.",
          variant: "destructive"
        });
        navigate('/legal/dashboard');
        return;
      }
      
      try {
        let submission = null;
        
        // Extract ID from end of slug (e.g. vendor-name-abc123def)
        if (vendorSlug.includes('-')) {
          const parts = vendorSlug.split('-');
          const idPart = parts[parts.length - 1];
          
          if (idPart && idPart.length >= 8) {
            const { data: idData, error: idError } = await supabase
              .from('compliance_submissions')
              .select('*')
              .ilike('id', `${idPart}%`)
              .limit(1)
              .maybeSingle();
            
            if (idData && !idError) {
              submission = idData;
            }
          }
        }
        
        // If ID method failed, try vendor name matching
        if (!submission) {
          const vendorName = vendorSlug.split('-').slice(0, -1).join(' ');
          
          const { data: nameData, error: nameError } = await supabase
            .from('compliance_submissions')
            .select('*')
            .ilike('vendor_name', `%${vendorName}%`)
            .limit(5);
          
          if (nameData && nameData.length > 0 && !nameError) {
            submission = nameData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          }
        }

        if (!submission) {
          toast({
            title: "Submission Not Found",
            description: `Could not find submission for "${vendorSlug}".`,
            variant: "destructive"
          });
          navigate('/legal/dashboard');
          return;
        }
        
        setSubmission(submission);
        
      } catch (error) {
        console.error('Error fetching submission:', error);
        toast({
          title: "Error",
          description: "Failed to load submission details.",
          variant: "destructive"
        });
        navigate('/legal/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [vendorSlug, navigate]);

  const handleDownloadCertificate = async () => {
    if (!submission || submission.status !== 'approved') {
      toast({
        title: "Certificate Not Available",
        description: "Certificate can only be downloaded for approved submissions.",
        variant: "destructive"
      });
      return;
    }

    setDownloading(true);
    try {
      // Navigate to certificate viewer which will handle the download/printing
      window.open(`/certificate/${submission.id}`, '_blank');
      
      toast({
        title: "Certificate Opened",
        description: "Certificate opened in new tab. You can print or save from there.",
      });
    } catch (error) {
      console.error('Error opening certificate:', error);
      toast({
        title: "Download Failed",
        description: "Failed to open certificate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk || 'Unknown'}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case "conditional":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Conditional Approval</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground mb-4">Submission not found</p>
          <Button onClick={() => navigate('/legal/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const formData = submission.form_data || {};
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/legal/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Legal Review - View Only
                </h1>
                <p className="text-muted-foreground">{submission.vendor_name} - {submission.service_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(submission.status)}
              {submission.status === 'approved' && submission.certificate_number && (
                <Button 
                  onClick={handleDownloadCertificate}
                  disabled={downloading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {downloading ? 'Opening...' : 'Certificate'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Legal Notice */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-lg">
              <FileText className="h-5 w-5" />
              Legal Review Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-blue-800 text-sm">
              This is a read-only view for legal review purposes. You cannot make approval decisions, but can download certificates for approved submissions.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic vendor and service details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Organization</Label>
                    <p className="font-medium">{submission.vendor_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                    <p className="font-medium">{formData.general_info?.contact_person || formData.email_collection?.contact_person || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="font-medium">{submission.vendor_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="font-medium">{formData.general_info?.contact_phone || 'N/A'}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Service Description</Label>
                  <p className="mt-1">{formData.general_info?.service_description || formData.email_collection?.service_description || submission.service_name}</p>
                </div>
              </CardContent>
            </Card>

            {/* Data Processing */}
            <Card>
              <CardHeader>
                <CardTitle>Data Processing</CardTitle>
                <CardDescription>How personal data is handled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data Types Processed</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(formData.data_processing?.data_types || formData.vendor_info?.dataTypes || []).map((type: string, index: number) => (
                      <Badge key={index} variant="secondary">{type}</Badge>
                    ))}
                    {(!formData.data_processing?.data_types && !formData.vendor_info?.dataTypes) && (
                      <span className="text-muted-foreground">No data types specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Purpose of Processing</Label>
                  <p className="mt-1">{formData.data_processing?.data_purpose || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data Location</Label>
                    <p className="font-medium">{formData.data_processing?.data_location?.toUpperCase() || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Retention Period</Label>
                    <p className="font-medium">{formData.data_processing?.data_retention || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Measures */}
            <Card>
              <CardHeader>
                <CardTitle>Security Measures</CardTitle>
                <CardDescription>Technical and organizational safeguards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Security Controls</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(formData.security_measures?.security_measures || []).map((measure: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-green-600 border-green-600">
                        {measure}
                      </Badge>
                    ))}
                    {(!formData.security_measures?.security_measures || formData.security_measures.security_measures.length === 0) && (
                      <span className="text-muted-foreground">No security measures specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(formData.security_measures?.certifications || []).map((cert: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">{cert}</Badge>
                    ))}
                    {(!formData.security_measures?.certifications || formData.security_measures.certifications.length === 0) && (
                      <span className="text-muted-foreground">No certifications specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Additional Information</Label>
                  <p className="mt-1">{formData.security_measures?.additional_security || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission Details</CardTitle>
                <CardDescription>Review information and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Current Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(submission.status)}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Risk Assessment</Label>
                    <div className="mt-1">
                      {getRiskBadge(submission.risk_level)}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Submitted</Label>
                    <p className="font-medium">{new Date(submission.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  {submission.reviewed_at && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Reviewed</Label>
                      <p className="font-medium">{new Date(submission.reviewed_at).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  {submission.certificate_number && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Certificate Number</Label>
                      <p className="font-medium">{submission.certificate_number}</p>
                    </div>
                  )}
                </div>

                {submission.review_comments && (
                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-muted-foreground">Review Comments</Label>
                    <p className="mt-1 text-sm">{submission.review_comments}</p>
                  </div>
                )}

                {submission.status === 'approved' && submission.certificate_number && (
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={handleDownloadCertificate}
                      disabled={downloading}
                      className="w-full flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {downloading ? 'Opening Certificate...' : 'View Certificate'}
                    </Button>
                  </div>
                )}

                {submission.risk_level === 'high' && (
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-amber-900">High Risk Submission</p>
                        <p className="text-xs text-amber-700">This submission requires special legal attention due to high risk classification.</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalReview;