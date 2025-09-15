import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const AdminReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [decision, setDecision] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [comments, setComments] = useState("");

  // Mock submission data - would be fetched from API
  const submission = {
    id: id || "1",
    vendorName: "TechCorp Solutions",
    serviceName: "Cloud Storage Service",
    submissionDate: "2024-01-15",
    status: "pending",
    sections: {
      general_info: {
        organization_name: "TechCorp Solutions",
        contact_person: "John Smith",
        contact_email: "john.smith@techcorp.com",
        contact_phone: "+1-555-0123",
        service_name: "Cloud Storage Service",
        service_description: "Secure cloud storage solution for enterprise data management with advanced encryption and access controls.",
        service_type: "new",
        processes_personal_data: "yes",
        university_access: "yes"
      },
      data_processing: {
        data_types: ["Email Addresses", "Employee Information", "Financial Data"],
        data_purpose: "To provide secure storage and management of university data with appropriate access controls and backup procedures.",
        data_location: "us",
        data_retention: "3years",
        third_party_sharing: "no",
        has_dpo: "yes"
      },
      security_measures: {
        security_measures: ["Encryption at rest", "Encryption in transit", "Multi-factor authentication", "Access controls"],
        certifications: ["SOC 2 Type II", "ISO 27001"],
        security_assessment_frequency: "annually",
        incident_response_plan: "yes",
        employee_training: "formal_regular",
        additional_security: "We implement additional monitoring and logging capabilities beyond standard requirements."
      }
    }
  };

  const handleDecision = async () => {
    if (!decision || !riskLevel) {
      toast({
        title: "Missing Information",
        description: "Please select both a decision and risk level.",
        variant: "destructive"
      });
      return;
    }

    try {
      // This would be replaced with actual API call
      console.log("Submitting decision:", { decision, riskLevel, comments });
      
      toast({
        title: "Decision Submitted",
        description: `The submission has been ${decision}. The vendor will be notified.`,
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your decision. Please try again.",
        variant: "destructive"
      });
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
                <p className="text-muted-foreground">{submission.vendorName} - {submission.serviceName}</p>
              </div>
            </div>
            <Badge variant="secondary">
              <FileText className="h-3 w-3 mr-1" />
              Pending Review
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
                    <p className="font-medium">{submission.sections.general_info.organization_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                    <p className="font-medium">{submission.sections.general_info.contact_person}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="font-medium">{submission.sections.general_info.contact_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="font-medium">{submission.sections.general_info.contact_phone}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Service Description</Label>
                  <p className="mt-1">{submission.sections.general_info.service_description}</p>
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
                    {submission.sections.data_processing.data_types.map((type) => (
                      <Badge key={type} variant="secondary">{type}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Purpose of Processing</Label>
                  <p className="mt-1">{submission.sections.data_processing.data_purpose}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data Location</Label>
                    <p className="font-medium">{submission.sections.data_processing.data_location.toUpperCase()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Retention Period</Label>
                    <p className="font-medium">{submission.sections.data_processing.data_retention}</p>
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
                    {submission.sections.security_measures.security_measures.map((measure) => (
                      <Badge key={measure} variant="outline" className="text-success border-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {measure}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {submission.sections.security_measures.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-primary border-primary">{cert}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Additional Information</Label>
                  <p className="mt-1">{submission.sections.security_measures.additional_security}</p>
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
                  disabled={!decision || !riskLevel}
                >
                  Submit Decision
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
                    {new Date(submission.submissionDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Data Processing</Label>
                  <Badge variant="outline" className="text-warning border-warning">Yes</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">University Access</Label>
                  <Badge variant="outline" className="text-warning border-warning">Yes</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Has DPO</Label>
                  <Badge variant="outline" className="text-success border-success">Yes</Badge>
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