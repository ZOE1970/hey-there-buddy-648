import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Submission } from "@/hooks/useSubmissions";

const AdminReview = () => {
  const navigate = useNavigate();
  const { vendorSlug } = useParams();
  const [decision, setDecision] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [comments, setComments] = useState("");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!vendorSlug) {
        console.log('No vendor slug provided');
        return;
      }
      
      console.log('Fetching submission with vendor slug:', vendorSlug);
      
      try {
        // Try to find by vendor name slug first
        const vendorName = vendorSlug.split('-').join(' ');
        
        let { data, error } = await supabase
          .from('compliance_submissions')
          .select('*')
          .ilike('vendor_name', `%${vendorName}%`)
          .limit(1)
          .maybeSingle();

        // If not found by name, try to extract ID from slug
        if (!data && vendorSlug.includes('-')) {
          const parts = vendorSlug.split('-');
          const idPart = parts[parts.length - 1];
          
          if (idPart && idPart.length >= 8) {
            const { data: idData, error: idError } = await supabase
              .from('compliance_submissions')
              .select('*')
              .ilike('id', `${idPart}%`)
              .limit(1)
              .maybeSingle();
            
            data = idData;
            error = idError;
          }
        }

        console.log('Supabase query result:', { data, error });

        if (error) throw error;
        
        if (!data) {
          throw new Error('Submission not found');
        }
        
        setSubmission(data);
        setRiskLevel(data.risk_level);
      } catch (error) {
        console.error('Error fetching submission:', error);
        toast({
          title: "Error",
          description: "Failed to load submission details.",
          variant: "destructive"
        });
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [vendorSlug, navigate]);

  const handleDecision = async () => {
    if (!decision || !riskLevel || !submission) {
      toast({
        title: "Missing Information",
        description: "Please select both a decision and risk level.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updates = {
        status: decision === 'approved' ? 'approved' : decision === 'rejected' ? 'rejected' : 'conditional',
        risk_level: riskLevel,
        review_decision: decision,
        review_comments: comments,
        reviewer_id: user.id
      };

      const { error } = await supabase
        .from('compliance_submissions')
        .update(updates)
        .eq('id', submission.id);

      if (error) throw error;
      
      toast({
        title: "Decision Submitted",
        description: `The submission has been ${decision}. The vendor will be notified.`,
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error submitting decision:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your decision. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge variant="outline" className="text-success border-success">Low Risk</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-warning border-warning">Medium Risk</Badge>;
      case "high":
        return <Badge variant="outline" className="text-destructive border-destructive">High Risk</Badge>;
      default:
        return null;
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
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Submission not found.</p>
          <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
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
              <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Review Submission</h1>
                <p className="text-muted-foreground">{submission.vendor_name} - {submission.service_name}</p>
              </div>
            </div>
            <Badge variant="secondary">
              <FileText className="h-3 w-3 mr-1" />
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
                    <p className="font-medium">{formData.general_info?.contact_person || 'N/A'}</p>
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
                  <p className="mt-1">{formData.general_info?.service_description || submission.service_name}</p>
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
                    {(formData.data_processing?.data_types || []).map((type: string, index: number) => (
                      <Badge key={index} variant="secondary">{type}</Badge>
                    ))}
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
                      <Badge key={index} variant="outline" className="text-success border-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {measure}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(formData.security_measures?.certifications || []).map((cert: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-primary border-primary">{cert}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Additional Information</Label>
                  <p className="mt-1">{formData.security_measures?.additional_security || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Decision</CardTitle>
                <CardDescription>Make your compliance decision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Decision *</Label>
                  <RadioGroup value={decision} onValueChange={setDecision}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="approved" id="approved" />
                      <Label htmlFor="approved" className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Approve
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rejected" id="rejected" />
                      <Label htmlFor="rejected" className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        Reject
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conditional" id="conditional" />
                      <Label htmlFor="conditional" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        Approve with Conditions
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Risk Level *</Label>
                  <RadioGroup value={riskLevel} onValueChange={setRiskLevel}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Low Risk</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium Risk</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High Risk</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add any comments or conditions for this decision..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleDecision} 
                  className="w-full bg-gradient-primary"
                  disabled={!decision || !riskLevel || submitting}
                >
                  {submitting ? "Submitting..." : "Submit Decision"}
                </Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Submitted</Label>
                  <span className="text-sm font-medium">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Data Processing</Label>
                  <Badge variant="outline" className="text-warning border-warning">
                    {formData.general_info?.processes_personal_data === 'yes' ? 'Yes' : 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">University Access</Label>
                  <Badge variant="outline" className="text-warning border-warning">
                    {formData.general_info?.university_access === 'yes' ? 'Yes' : 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Has DPO</Label>
                  <Badge variant="outline" className="text-success border-success">
                    {formData.data_processing?.has_dpo === 'yes' ? 'Yes' : 'Unknown'}
                  </Badge>
                </div>
                {riskLevel && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Label className="text-sm text-muted-foreground">Assessed Risk</Label>
                    {getRiskBadge(riskLevel)}
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

export default AdminReview;