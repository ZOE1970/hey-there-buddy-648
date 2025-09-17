import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubmissionSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl text-success">Form Submitted Successfully!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your data protection compliance form has been received and is now under review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground">What happens next?</h3>
              <div className="space-y-2 text-sm text-muted-foreground text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <p>Our compliance team will review your submission within 5-7 business days.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <p>You'll receive an email notification once the review is complete.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <p>If approved, you'll be able to download your compliance certificate.</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <div className="font-medium">Submission Reference</div>
                    <div className="text-sm text-muted-foreground">REF-{Date.now().toString().slice(-8)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Submitted</div>
                  <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/vendor/dashboard')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/vendor/form')}
                className="bg-gradient-primary"
              >
                Submit Another Form
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>
                If you have any questions about your submission, please contact our compliance team at{" "}
                <a href="mailto:dpo@run.edu.ng" className="text-primary hover:underline">
                  dpo@run.edu.ng
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionSuccess;