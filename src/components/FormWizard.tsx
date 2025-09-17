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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Data Protection Compliance Form</h1>
              <p className="text-muted-foreground mt-1">
                Step {currentStep + 1} of {sections.length}: {currentSection.title}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/vendor/dashboard')}>
              Exit Form
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {currentSection.title}
                <span className="text-sm font-normal text-muted-foreground">
                  Section {currentStep + 1}/{sections.length}
                </span>
              </CardTitle>
              <CardDescription>{currentSection.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Render Current Section Component */}
              <currentSection.component 
                data={formData[currentSection.id] || {}}
                onChange={handleDataChange}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save & Continue Later
                  </Button>
                </div>

                <div className="flex gap-2">
                  {!isLastStep ? (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="bg-gradient-primary">
                      Submit Form
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Navigation */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Form Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {sections.map((section, index) => (
                  <Button
                    key={section.id}
                    variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentStep(index)}
                    className="h-auto p-2 text-xs"
                  >
                    <div className="text-center">
                      <div className="font-medium">{index + 1}</div>
                      <div className="hidden sm:block truncate">
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