import FormWizard from "@/components/FormWizard";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Form Section Components
import GeneralInfoSection from "@/components/form-sections/GeneralInfoSection";
import BasicInfoSection from "@/components/form-sections/BasicInfoSection";
import VendorInfoSection from "@/components/form-sections/VendorInfoSection";
import ComplianceIntroSection from "@/components/form-sections/ComplianceIntroSection";
import LegalContractualSection from "@/components/form-sections/LegalContractualSection";
import GovernanceAccountabilitySection from "@/components/form-sections/GovernanceAccountabilitySection";
import SecurityMeasuresSection from "@/components/form-sections/SecurityMeasuresSection";
import DataProcessingSection from "@/components/form-sections/DataProcessingSection";
import DataSubjectRightsSection from "@/components/form-sections/DataSubjectRightsSection";
import DataBreachSection from "@/components/form-sections/DataBreachSection";
import CrossBorderSection from "@/components/form-sections/CrossBorderSection";
import MonitoringOversightSection from "@/components/form-sections/MonitoringOversightSection";
import ExitTerminationSection from "@/components/form-sections/ExitTerminationSection";

const ComplianceForm = () => {
  const navigate = useNavigate();

  const formSections = [
    {
      id: "email_collection",
      title: "Email Collection",
      description: "This form is collecting emails for vendor compliance tracking.",
      component: GeneralInfoSection
    },
    {
      id: "basic_info",
      title: "Basic Information", 
      description: "Vendor/Third Party Name, Service/Product, and Date",
      component: BasicInfoSection
    },
    {
      id: "vendor_info",
      title: "Vendor Information",
      description: "Detailed vendor information including contact details and data processing scope.",
      component: VendorInfoSection
    },
    {
      id: "compliance_intro",
      title: "Vendor Compliance Checklist",
      description: "Introduction to the compliance assessment checklist.",
      component: ComplianceIntroSection
    },
    {
      id: "legal_contractual",
      title: "Legal & Contractual Requirements",
      description: "Assessment of legal agreements and contractual obligations.",
      component: LegalContractualSection
    },
    {
      id: "governance_accountability",
      title: "Governance & Accountability",
      description: "Data protection governance structures and accountability measures.",
      component: GovernanceAccountabilitySection
    },
    {
      id: "security_measures",
      title: "Security Measures",
      description: "Technical and organizational security measures implemented.",
      component: SecurityMeasuresSection
    },
    {
      id: "data_subject_rights",
      title: "Data Subject Rights",
      description: "Support for data subject access, correction, erasure and other rights.",
      component: DataSubjectRightsSection
    },
    {
      id: "data_processing",
      title: "Data Processing",
      description: "Data processing and management procedures.",
      component: DataProcessingSection
    },
    {
      id: "DBM",
      title: "Data Breach",
      description: "Incident response plans and breach notification procedures.",
      component: DataBreachSection
    },
    {
      id: "cross_border_transfer",
      title: "Cross-Border Data Transfer",
      description: "International data transfer safeguards and compliance measures.",
      component: CrossBorderSection
    },
    {
      id: "monitoring_oversight",
      title: "Monitoring & Oversight",
      description: "Ongoing monitoring and audit provisions for vendor oversight.",
      component: MonitoringOversightSection
    },
    {
      id: "exit_termination",
      title: "Exit & Termination",
      description: "Data return, deletion and transition procedures upon contract termination.",
      component: ExitTerminationSection
    },
   
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      console.log("Submitting form data:", formData);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to submit a form');
      }

      // Get user profile for vendor name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, company')
        .eq('id', user.id)
        .maybeSingle();

      const vendorName = profile?.company || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unknown Vendor';
      
      // Submit to compliance_submissions table
      const { error: submitError } = await supabase
        .from('compliance_submissions')
        .insert({
          vendor_name: vendorName,
          vendor_email: user.email!,
          service_name: formData.service_name || formData.serviceName || 'Unknown Service',
          form_data: formData,
          status: 'pending'
        });

      if (submitError) {
        throw submitError;
      }
      
      toast({
        title: "Form Submitted Successfully",
        description: "Your compliance form has been submitted for review.",
      });
      
      navigate('/vendor/submission-success');
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your form. Please try again.",
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