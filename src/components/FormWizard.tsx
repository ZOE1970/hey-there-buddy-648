import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormWizardProps {
  sections: FormSection[];
  onSubmit: (data: Record<string, any>) => void;
  onSave?: (data: Record<string, any>) => void;
}

interface FormSection {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<{
    data: Record<string, any>;
    onChange: (data: Record<string, any>) => void;
  }>;
}

const FormWizard = ({ sections, onSubmit, onSave }: FormWizardProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const currentSection = sections[currentStep];
  const progress = ((currentStep + 1) / sections.length) * 100;

  const handleNext = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (sectionData: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      [currentSection.id]: sectionData
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isLastStep = currentStep === sections.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-gradient-form shadow-premium">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Data Protection Compliance Form</h1>
              <p className="text-primary-foreground/80 mt-1">
                Step {currentStep + 1} of {sections.length}: {currentSection.title}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/vendor/dashboard')} className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Dashboard
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-primary-foreground/70 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="relative h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-rainbow rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-premium border-2 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-rainbow opacity-10 pointer-events-none"></div>
            <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 border-b border-border/50 relative z-10">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="bg-gradient-accent bg-clip-text text-transparent font-bold">
                  {currentSection.title}
                </span>
                <span className="text-sm font-normal text-muted-foreground bg-gradient-secondary px-3 py-1 rounded-full">
                  Section {currentStep + 1}/{sections.length}
                </span>
              </CardTitle>
              <CardDescription className="text-base">{currentSection.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8 relative z-10">
              {/* Render Current Section Component */}
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 p-6 rounded-lg border-2 border-gradient-to-r from-primary/20 via-accent/20 to-success/20 shadow-md">
                <currentSection.component 
                  data={formData[currentSection.id] || {}}
                  onChange={handleDataChange}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t-2 border-gradient-to-r from-primary/20 via-accent/20 to-success/20">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="border-2 hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {!isLastStep && (
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className="border-2 border-success/30 text-success hover:bg-success/10 hover:shadow-lg transition-all duration-300"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save & Continue Later
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  {!isLastStep && (
                    <Button 
                      onClick={handleNext}
                      className="bg-gradient-form hover:shadow-premium transition-all duration-300 px-6"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Submit Button for Last Step */}
              {isLastStep && (
                <div className="mt-8 p-6 bg-gradient-to-br from-success/10 to-primary/10 rounded-lg border-2 border-success/30 text-center">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Ready to Submit Your Compliance Form</h3>
                  <p className="text-muted-foreground mb-6">
                    Please review all sections before submitting. Once submitted, your form will be reviewed by our compliance team.
                  </p>
                  <Button 
                    onClick={handleSubmit} 
                    size="lg"
                    className="bg-gradient-rainbow hover:shadow-rainbow transition-all duration-300 px-12 py-3 text-white font-semibold text-lg"
                  >
                    Submit Form for Review
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section Navigation */}
          <Card className="mt-8 shadow-lg border-2 bg-gradient-to-br from-card to-card/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 border-b border-border/50">
              <CardTitle className="text-lg bg-gradient-accent bg-clip-text text-transparent">Form Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {sections.map((section, index) => (
                  <Button
                    key={section.id}
                    variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentStep(index)}
                    className={`h-auto p-3 text-xs transition-all duration-300 hover:scale-105 ${
                      index === currentStep 
                        ? "bg-gradient-form shadow-premium border-2" 
                        : index < currentStep 
                        ? "bg-gradient-secondary border-2 border-success/30 text-success shadow-md" 
                        : "border-2 hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-sm">{index + 1}</div>
                      <div className="hidden sm:block truncate text-xs mt-1">
                        {section.title === "Data Subject Rights" ? "Rights" :
                         section.title === "Data Processing" ? "Processing" :
                         section.title === "Data Breach" ? "Breach" :
                         section.title.split(' ')[0]}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormWizard;