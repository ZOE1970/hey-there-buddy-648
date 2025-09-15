import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ApprovalSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const ApprovalSection = ({ data, onChange }: ApprovalSectionProps) => {
  const handleInputChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium">
          <strong>Note:</strong> This section requires official authorization and signatures from the University Data Protection Officer and Management.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Recommendation *</Label>
          <RadioGroup
            value={data.recommendation || ""}
            onValueChange={(value) => handleInputChange("recommendation", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="approved" id="approved" />
              <Label htmlFor="approved">Approved for engagement.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="approved-with-remediation" id="approved-with-remediation" />
              <Label htmlFor="approved-with-remediation">Approved subject to remediation.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-approved" id="not-approved" />
              <Label htmlFor="not-approved">Not approved.</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">University Data Protection Officer (DPO)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dpoName">Name *</Label>
              <Input
                id="dpoName"
                value={data.dpoName || ""}
                onChange={(e) => handleInputChange("dpoName", e.target.value)}
                placeholder="DPO full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dpoSignature">Signature</Label>
              <Input
                id="dpoSignature"
                value={data.dpoSignature || ""}
                onChange={(e) => handleInputChange("dpoSignature", e.target.value)}
                placeholder="Digital signature or initials"
              />
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="dpoDate">Date</Label>
            <Input
              id="dpoDate"
              type="date"
              value={data.dpoDate || ""}
              onChange={(e) => handleInputChange("dpoDate", e.target.value)}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">University Management Approval</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="managementName">Name *</Label>
              <Input
                id="managementName"
                value={data.managementName || ""}
                onChange={(e) => handleInputChange("managementName", e.target.value)}
                placeholder="Management representative name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="managementDesignation">Designation *</Label>
              <Input
                id="managementDesignation"
                value={data.managementDesignation || ""}
                onChange={(e) => handleInputChange("managementDesignation", e.target.value)}
                placeholder="Job title/position"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="managementDate">Date</Label>
              <Input
                id="managementDate"
                type="date"
                value={data.managementDate || ""}
                onChange={(e) => handleInputChange("managementDate", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalSection;