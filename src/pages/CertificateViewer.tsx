import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import cdpoCertificate from "@/assets/cdpo-logo-nobg.png";
import universityLogo from "@/assets/redeemers-university-logo.png";
import dpoSeal from "@/assets/run-seal.png";
import { supabase } from "@/integrations/supabase/client";

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
      
      try {
        // First try to find by ID
        let { data, error } = await supabase
          .from('compliance_submissions')
          .select('*')
          .eq('id', id)
          .single();

        // If not found by ID, try by certificate number
        if (error && error.code === 'PGRST116') {
          const { data: certData, error: certError } = await supabase
            .from('compliance_submissions')
            .select('*')
            .eq('certificate_number', id)
            .single();
          
          data = certData;
          error = certError;
        }

        // If still not found, try by serial number (if id is a number)
        if (error && error.code === 'PGRST116' && !isNaN(Number(id))) {
          const { data: serialData, error: serialError } = await supabase
            .from('compliance_submissions')
            .select('*')
            .eq('serial_number', parseInt(id))
            .single();
          
          data = serialData;
          error = serialError;
        }

        if (error) {
          console.error('Database error:', error);
          throw error;
        }
        
        if (data) {
          const today = new Date();
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          
          setCertificate({
            id: data.id,
            vendorName: data.vendor_name,
            serviceName: data.service_name,
            approvalDate: data.reviewed_at || data.created_at,
            validUntil: nextYear.toISOString().split('T')[0],
            dpoName: "Adenle Samuel",
            certificateNumber: data.certificate_number || `RUN-CERT-${new Date().getFullYear()}-${String(data.serial_number).padStart(3, '0')}`,
            riskLevel: data.risk_level,
            serialNumber: data.serial_number
          });
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
      } finally {
        setLoading(false);
      }
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
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Certificate not found</p>
          <p className="text-sm text-muted-foreground">
            The certificate ID "{id}" does not exist or may not be approved yet.
          </p>
          <Button variant="outline" onClick={() => navigate('/vendor/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (!certificate) return;
    
    // Create a new window with the certificate content for PDF generation
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${certificate.certificateNumber}</title>
            <meta charset="utf-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body { 
                font-family: 'Times New Roman', serif; 
                margin: 0; 
                padding: 20px;
                color: #1a1a1a;
                background: white;
                line-height: 1.6;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .certificate-container { 
                max-width: 210mm;
                min-height: auto;
                margin: 0 auto; 
                padding: 30px;
                border: 3px solid #2563eb;
                border-radius: 12px;
                background: #ffffff;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                page-break-inside: avoid;
              }
              
              .university-header {
                text-align: center;
                margin-bottom: 2rem;
              }
              
              .university-logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 1rem;
                object-fit: contain;
              }
              
              .university-title {
                font-size: 2rem;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 0.5rem;
              }
              
              .university-subtitle {
                font-size: 1.125rem;
                color: #6b7280;
                margin-bottom: 1rem;
              }
              
              .divider {
                width: 60px;
                height: 3px;
                background: #2563eb;
                margin: 0 auto;
                opacity: 0.3;
              }
              
              .certificate-title {
                text-align: center;
                margin-bottom: 2rem;
              }
              
              .certificate-title h2 {
                font-size: 1.75rem;
                font-weight: bold;
                margin-bottom: 1rem;
                letter-spacing: 0.025em;
              }
              
              .certificate-description {
                color: #6b7280;
                font-size: 1rem;
              }
              
              .details-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
              }
              
              .detail-section {
                margin-bottom: 1.5rem;
              }
              
              .detail-label {
                font-size: 0.875rem;
                font-weight: 500;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.025em;
                margin-bottom: 0.25rem;
              }
              
              .detail-value {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1a1a1a;
              }
              
              .compliance-box {
                background: rgba(34, 197, 94, 0.05);
                border: 1px solid rgba(34, 197, 94, 0.2);
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
              }
              
              .signature-section {
                border-top: 1px solid #e5e7eb;
                padding-top: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 2rem;
              }
              
              .signature-left, .signature-right {
                text-align: center;
              }
              
              .signature-box {
                width: 120px;
                height: 60px;
                background: rgba(0,0,0,0.05);
                border: 2px dashed rgba(0,0,0,0.2);
                border-radius: 4px;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                color: #6b7280;
              }
              
              .seal-container {
                width: 60px;
                height: 60px;
                background: rgba(37, 99, 235, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 8px;
                margin-bottom: 0.5rem;
              }
              
              .seal-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
              
              .footer-text {
                text-align: center;
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e5e7eb;
                font-size: 0.75rem;
                color: #6b7280;
                line-height: 1.4;
              }
              
              @media print {
                body { 
                  margin: 0;
                  padding: 0;
                  background: white;
                }
                
                .certificate-container { 
                  border: none;
                  box-shadow: none;
                  padding: 30px;
                  margin: 0;
                  width: 100%;
                  max-width: none;
                  min-height: auto;
                }
                
                @page {
                  size: A4;
                  margin: 15mm;
                }
              }
            </style>
          </head>
          <body>
            <div class="certificate-container">
              <div class="university-header">
                <img src="${universityLogo}" alt="Redeemer's University Logo" class="university-logo" />
                <h1 class="university-title">Data Protection Office</h1>
                <h2 class="university-subtitle">Redeemer's University</h2>
                <div class="divider"></div>
              </div>
              
              <div class="certificate-title">
                <h2>THIRD-PARTY VENDOR COMPLIANCE CERTIFICATE</h2>
                <p class="certificate-description">
                  This certifies that the following vendor has successfully completed our data protection compliance review
                </p>
              </div>
              
              <div class="details-grid">
                <div>
                  <div class="detail-section">
                    <div class="detail-label">Vendor Organization</div>
                    <div class="detail-value">${certificate.vendorName}</div>
                  </div>
                  <div class="detail-section">
                    <div class="detail-label">Service/Product</div>
                    <div class="detail-value">${certificate.serviceName}</div>
                  </div>
                </div>
                <div>
                  <div class="detail-section">
                    <div class="detail-label">Approval Date</div>
                    <div class="detail-value">${new Date(certificate.approvalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div class="detail-section">
                    <div class="detail-label">Valid Until</div>
                    <div class="detail-value">${new Date(certificate.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
              </div>
              
              <div class="details-grid">
                <div class="detail-section">
                  <div class="detail-label">Certificate Number</div>
                  <div class="detail-value" style="font-family: monospace;">${certificate.certificateNumber}</div>
                </div>
                <div class="detail-section">
                  <div class="detail-label">Risk Assessment</div>
                  <div class="detail-value" style="color: #059669;">✓ ${certificate.riskLevel} Risk</div>
                </div>
              </div>
              
              <div class="compliance-box">
                <div style="color: #059669; font-size: 1.5rem; margin-top: 2px;">✓</div>
                <div>
                  <h3 style="font-weight: 600; color: #059669; margin-bottom: 0.5rem;">Compliance Verified</h3>
                  <p style="font-size: 0.875rem;">
                    This vendor has demonstrated compliance with university data protection policies and procedures. 
                    The vendor's security measures, data handling practices, and privacy controls have been reviewed 
                    and approved by our compliance team.
                  </p>
                </div>
              </div>
              
              <div class="signature-section">
                <div class="signature-left">
                  <div class="signature-box">Digital Signature</div>
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">${certificate.dpoName}</div>
                  <div style="font-size: 0.875rem; color: #6b7280;">Data Protection Officer</div>
                </div>
                <div class="signature-right">
                  <div class="seal-container">
                    <img src="${dpoSeal}" alt="DPO Seal" class="seal-image" />
                  </div>
                  <div style="font-size: 0.875rem; color: #6b7280;">DPO Seal</div>
                </div>
              </div>
              
              <div class="footer-text">
                <p>This certificate is valid for one year from the approval date and may be subject to periodic review.</p>
                <p style="margin-top: 0.25rem;">Data Protection Office • dpo@run.edu.ng</p>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
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
                <img src={universityLogo} alt="Redeemer's University Logo" className="h-32 w-32 mx-auto mb-4 object-contain drop-shadow-lg" />
                <h1 className="text-3xl font-bold text-primary mb-2">Data Protection Office</h1>
                <h2 className="text-lg text-muted-foreground mb-2">Redeemer's University</h2>
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
                     <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mb-2 p-2">
                       <img src={dpoSeal} alt="DPO Seal" className="h-full w-full object-contain drop-shadow-md" />
                     </div>
                      <p className="text-sm text-muted-foreground">DPO Seal</p>
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