import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Building, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 mx-auto mb-6 text-primary-foreground" />
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Vendor Data Protection Compliance Portal
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Streamline your third-party vendor compliance process with our comprehensive data protection checklist system.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Vendor Card */}
          <Card className="border-primary-foreground/20 bg-card/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-6">
              <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Vendor Access</CardTitle>
              <CardDescription className="text-base">
                Submit and manage your data protection compliance forms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">Submit compliance forms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">Track submission status</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">Download certificates</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={() => navigate('/vendor/dashboard')}
              >
                Access Vendor Portal
              </Button>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="border-primary-foreground/20 bg-card/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription className="text-base">
                Review and manage vendor compliance submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">Review submissions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">Approve or reject forms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">Generate certificates</span>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="w-full mt-6" 
                size="lg"
                onClick={() => navigate('/admin/dashboard')}
              >
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-primary-foreground/60">
          <p className="text-sm">
            Secure • Compliant • Efficient
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;