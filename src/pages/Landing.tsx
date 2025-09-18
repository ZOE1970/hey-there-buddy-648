import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import runLogo from "@/assets/run-university-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  // No automatic redirect - show landing page for everyone

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <a href="https://run.edu.ng" target="_blank" rel="noopener noreferrer">
            <img src={runLogo} alt="Redeemer's University Logo" className="h-20 w-40 md:h-28 md:w-56 object-contain mx-auto mb-4 md:mb-6 drop-shadow-lg" />
          </a>
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3 md:mb-4 px-2">
            Vendor Data Protection Compliance Portal
          </h1>
          <p className="text-base md:text-xl text-primary-foreground/80 max-w-2xl mx-auto px-4">
            Third-Party Vendor Comprehensive Data Protection System.
          </p>
        </div>

        {/* Vendor Card Only */}
        <div className="max-w-md mx-auto mb-8 md:mb-12 px-2">
          <Card className="border-primary-foreground/20 bg-card/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4 md:pb-6">
              <Building className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-primary" />
              <CardTitle className="text-xl md:text-2xl">Vendor Access</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Submit and manage your data protection compliance forms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-success" />
                  <span className="text-xs md:text-sm">Submit compliance forms</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-success" />
                  <span className="text-xs md:text-sm">Track submission status</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-success" />
                  <span className="text-xs md:text-sm">Download certificates</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4 md:mt-6" 
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Access Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Login Hint (optional) */}
        <div className="text-center text-primary-foreground/60 px-2">
          <p className="text-xs md:text-sm mb-2">
            Secure • Compliant • Efficient
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default Landing;