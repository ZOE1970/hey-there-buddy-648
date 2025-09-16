import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import runSeal from "@/assets/run-seal.png";

interface CertificateData {
  id: string;
  vendorName: string;
  serviceName: string;
  approvalDate: string;
  validUntil: string;
  dpoName: string;
  certificateNumber: string;
  riskLevel: string;
  serialNumber?: number;
}

const CertificateViewer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      // For now, use mock data since the database types haven't been updated
      // TODO: Replace with actual database fetch when types are available
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      
      setCertificate({
        id: id || "1",
        vendorName: "Redeemers University Data Protection Office", 
        serviceName: "Cloud Storage Service",
        approvalDate: today.toISOString().split('T')[0],
        validUntil: nextYear.toISOString().split('T')[0],
        dpoName: "Adenle Samuel",
        certificateNumber: `RUN-CERT-${new Date().getFullYear()}-001`,
        riskLevel: "Low"
      });
      
      setLoading(false);
    };

    fetchCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Certificate not found</p>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (!certificate) return;
    
    // Generate PDF download
    const printWindow = window.open('', '_blank');
    const certificateContent = document.querySelector('.certificate-content');
    
    if (printWindow && certificateContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${certificate.certificateNumber}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #1a1a1a;
                background: white;
              }
              .certificate-content { 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 40px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
              }
              .text-center { text-align: center; }
              .mb-8 { margin-bottom: 2rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-2 { margin-bottom: 0.5rem; }
              .grid { display: grid; gap: 1.5rem; }
              .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
              .font-bold { font-weight: bold; }
              .text-lg { font-size: 1.125rem; }
              .text-xl { font-size: 1.25rem; }
              .text-2xl { font-size: 1.5rem; }
              .text-3xl { font-size: 1.875rem; }
              .text-sm { font-size: 0.875rem; }
              .text-xs { font-size: 0.75rem; }
              .border-t { border-top: 1px solid #e5e7eb; padding-top: 2rem; }
              .uppercase { text-transform: uppercase; }
              .tracking-wide { letter-spacing: 0.025em; }
              img { max-width: 64px; height: auto; margin: 0 auto; }
              @media print { 
                body { margin: 0; } 
                .certificate-content { border: none; }
              }
            </style>
          </head>
          <body>
            ${certificateContent.outerHTML.replace(/class="[^"]*"/g, '')}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePrint = () => {
    window.print();
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
          <Card className="bg-gradient-secondary border-2 border-primary/20 shadow-xl certificate-content">
            <CardContent className="p-12">
              {/* University Header */}
              <div className="text-center mb-8">
                <img src={runSeal} alt="RUN Seal" className="h-16 w-16 mx-auto mb-4 object-contain" />
                <h1 className="text-3xl font-bold text-primary mb-2">Data Protection Office</h1>
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
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 p-2">
                      <img src={runSeal} alt="University Seal" className="h-full w-full object-contain" />
                    </div>
                    <p className="text-sm text-muted-foreground">University Seal</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t text-xs text-muted-foreground">
                <p>This certificate is valid for one year from the approval date and may be subject to periodic review.</p>
                <p className="mt-1">Data Protection Office • dpo@run.edu.ng</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={handlePrint}>
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