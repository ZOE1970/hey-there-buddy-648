import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface SecurityMeasuresSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const SecurityMeasuresSection = ({ data, onChange }: SecurityMeasuresSectionProps) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const currentValues = data[field] || [];
    if (checked) {
      handleChange(field, [...currentValues, value]);
    } else {
      handleChange(field, currentValues.filter((v: string) => v !== value));
    }
  };

  const securityMeasures = [
    "Encryption at rest",
    "Encryption in transit",
    "Multi-factor authentication",
    "Access controls",
    "Regular security audits",
    "Employee background checks",
    "Security awareness training",
    "Incident response plan",
    "Data backup procedures",
    "Network security monitoring"
  ];

  const certifications = [
    "SOC 2 Type II",
    "ISO 27001",
    "GDPR Compliance",
    "HIPAA Compliance",
    "FedRAMP",
    "PCI DSS",
    "Other"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>What security measures are implemented? (Select all that apply) *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {securityMeasures.map((measure) => (
              <div key={measure} className="flex items-center space-x-2">
                <Checkbox
                  id={measure}
                  checked={(data.security_measures || []).includes(measure)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("security_measures", measure, checked as boolean)
                  }
                />
                <Label htmlFor={measure} className="text-sm font-normal">{measure}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Do you have any security certifications? (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center space-x-2">
                <Checkbox
                  id={cert}
                  checked={(data.certifications || []).includes(cert)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("certifications", cert, checked as boolean)
                  }
                />
                <Label htmlFor={cert} className="text-sm font-normal">{cert}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>How often are security assessments conducted? *</Label>
          <RadioGroup
            value={data.security_assessment_frequency || ""}
            onValueChange={(value) => handleChange("security_assessment_frequency", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="annually" id="annually" />
              <Label htmlFor="annually">Annually</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="biannually" id="biannually" />
              <Label htmlFor="biannually">Bi-annually</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="quarterly" id="quarterly" />
              <Label htmlFor="quarterly">Quarterly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="continuous" id="continuous" />
              <Label htmlFor="continuous">Continuous monitoring</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">No formal assessments</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Do you have a documented incident response plan? *</Label>
          <RadioGroup
            value={data.incident_response_plan || ""}
            onValueChange={(value) => handleChange("incident_response_plan", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes_incident" />
              <Label htmlFor="yes_incident">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no_incident" />
              <Label htmlFor="no_incident">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in_development" id="in_development" />
              <Label htmlFor="in_development">In Development</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>How are employees trained on data protection? *</Label>
          <RadioGroup
            value={data.employee_training || ""}
            onValueChange={(value) => handleChange("employee_training", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="formal_regular" id="formal_regular" />
              <Label htmlFor="formal_regular">Formal training program (regular updates)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="formal_onboarding" id="formal_onboarding" />
              <Label htmlFor="formal_onboarding">Formal training (onboarding only)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="informal" id="informal" />
              <Label htmlFor="informal">Informal training</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none_training" id="none_training" />
              <Label htmlFor="none_training">No specific training</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional_security">Additional Security Information</Label>
          <Textarea
            id="additional_security"
            value={data.additional_security || ""}
            onChange={(e) => handleChange("additional_security", e.target.value)}
            placeholder="Please provide any additional information about your security measures, policies, or procedures"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default SecurityMeasuresSection;