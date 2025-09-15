import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface UniversityAssessmentSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const UniversityAssessmentSection = ({ data, onChange }: UniversityAssessmentSectionProps) => {
  const handleInputChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800 font-medium">
          <strong>Note:</strong> This section is to be completed by the University Data Protection Officer (DPO) or authorized reviewer.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reviewerName">Reviewer Name *</Label>
          <Input
            id="reviewerName"
            value={data.reviewerName || ""}
            onChange={(e) => handleInputChange("reviewerName", e.target.value)}
            placeholder="Full name of the reviewer"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reviewerPosition">Position *</Label>
          <Input
            id="reviewerPosition"
            value={data.reviewerPosition || ""}
            onChange={(e) => handleInputChange("reviewerPosition", e.target.value)}
            placeholder="Job title/position"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reviewDate">Date of Review *</Label>
          <Input
            id="reviewDate"
            type="date"
            value={data.reviewDate || ""}
            onChange={(e) => handleInputChange("reviewDate", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label>Assessment Summary (check one) *</Label>
          <RadioGroup
            value={data.assessmentSummary || ""}
            onValueChange={(value) => handleInputChange("assessmentSummary", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="meets-requirements" id="meets-requirements" />
              <Label htmlFor="meets-requirements">Vendor meets requirements.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="needs-remediation" id="needs-remediation" />
              <Label htmlFor="needs-remediation">Vendor meets most requirements, but remediation is needed.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="does-not-meet" id="does-not-meet" />
              <Label htmlFor="does-not-meet">Vendor does not meet minimum requirements.</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="comments">Comments / Observations *</Label>
          <Textarea
            id="comments"
            value={data.comments || ""}
            onChange={(e) => handleInputChange("comments", e.target.value)}
            placeholder="Provide detailed comments and observations..."
            rows={4}
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label>Risk Rating *</Label>
          <RadioGroup
            value={data.riskRating || ""}
            onValueChange={(value) => handleInputChange("riskRating", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="risk-low" />
              <Label htmlFor="risk-low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="risk-medium" />
              <Label htmlFor="risk-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="risk-high" />
              <Label htmlFor="risk-high">High</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default UniversityAssessmentSection;