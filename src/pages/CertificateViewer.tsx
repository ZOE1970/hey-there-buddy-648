import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const CertificateViewer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock certificate data - would be fetched from API
  const certificate = {
    id: id || "1",
    vendorName: "TechCorp Solutions",
    serviceName: "Cloud Storage Service",
    approvalDate: "2024-01-20",
    validUntil: "2025-01-20",
    dpoName: "Dr. Sarah Johnson",
    certificateNumber: "GDPR-CERT-2024-001",
    riskLevel: "Low"
  };

  const handleDownload = () => {
    // This would trigger the actual PDF download
    console.log("Downloading certificate PDF...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/vendor/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Compliance Certificate</h1>
                <p className="text-muted-foreground">Certificate #{certificate.certificateNumber}</p>
              </div>
            </div>
            <Button onClick={handleDownload} className="bg-gradient-primary">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Certificate Card */}
          <Card className="bg-gradient-secondary border-2 border-primary/20 shadow-xl">
            <CardContent className="p-12">
              {/* University Header */}
              <div className="text-center mb-8">
                <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h1 className="text-3xl font-bold text-primary mb-2">University Data Protection Office</h1>
                <div className="w-24 h-1 bg-primary/30 mx-auto"></div>
              </div>

              {/* Certificate Title */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  THIRD-PARTY VENDOR COMPLIANCE CERTIFICATE
                </h2>
                <p className="text-muted-foreground">
                  This certifies that the following vendor has successfully completed our data protection compliance review
                </p>
              </div>

              {/* Certificate Details */}
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Vendor Organization</h3>
                      <p className="text-xl font-semibold text-foreground">{certificate.vendorName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Service/Product</h3>
                      <p className="text-xl font-semibold text-foreground">{certificate.serviceName}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Approval Date</h3>
                      <p className="text-xl font-semibold text-foreground">
                        {new Date(certificate.approvalDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Valid Until</h3>
                      <p className="text-xl font-semibold text-foreground">
                        {new Date(certificate.validUntil).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Certificate Number</h3>
                    <p className="text-lg font-mono font-semibold text-foreground">{certificate.certificateNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Risk Assessment</h3>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-lg font-semibold text-success">{certificate.riskLevel} Risk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Statement */}
              <div className="bg-success/5 border border-success/20 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-success mb-2">Compliance Verified</h3>
                    <p className="text-sm text-foreground">
                      This vendor has demonstrated compliance with university data protection policies and procedures. 
                      The vendor's security measures, data handling practices, and privacy controls have been reviewed 
                      and approved by our compliance team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="border-t pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <div className="w-32 h-16 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
                      <span className="text-xs text-muted-foreground">Digital Signature</span>
                    </div>
                    <p className="font-semibold text-foreground">{certificate.dpoName}</p>
                    <p className="text-sm text-muted-foreground">Data Protection Officer</p>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">University Seal</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t text-xs text-muted-foreground">
                <p>This certificate is valid for one year from the approval date and may be subject to periodic review.</p>
                <p className="mt-1">University Data Protection Office • compliance@university.edu • (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.print()}>
              Print Certificate
            </Button>
            <Button onClick={handleDownload} className="bg-gradient-primary">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;