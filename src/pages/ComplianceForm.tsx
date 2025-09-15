import FormWizard from "@/components/FormWizard";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Form Section Components
import GeneralInfoSection from "@/components/form-sections/GeneralInfoSection";
import DataProcessingSection from "@/components/form-sections/DataProcessingSection";
import SecurityMeasuresSection from "@/components/form-sections/SecurityMeasuresSection";

const ComplianceForm = () => {
  const navigate = useNavigate();

  const formSections = [
    {
      id: "general_info",
      title: "General Information",
      description: "Basic information about your organization and the service being evaluated.",
      component: GeneralInfoSection
    },
    {
      id: "data_processing",
      title: "Data Processing",
      description: "Details about how personal data is collected, processed, and stored.",
      component: DataProcessingSection
    },
    {
      id: "security_measures",
      title: "Security Measures",
      description: "Technical and organizational security measures implemented.",
      component: SecurityMeasuresSection
    },
    // Additional sections would be added here for the full 14-section form
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      // This would be replaced with actual API call
      console.log("Submitting form data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Form Submitted Successfully",
        description: "Your compliance form has been submitted for review.",
      });
      
      navigate('/vendor/submission-success');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (formData: Record<string, any>) => {
    try {
      // This would be replaced with actual API call to save draft
      console.log("Saving form data:", formData);
      
      toast({
        title: "Form Saved",
        description: "Your progress has been saved. You can continue later.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your form. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <FormWizard
      sections={formSections}
      onSubmit={handleSubmit}
      onSave={handleSave}
    />
  );
};

export default ComplianceForm;