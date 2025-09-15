import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface VendorInfoSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const VendorInfoSection = ({ data, onChange }: VendorInfoSectionProps) => {
  const handleInputChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    const currentTypes = data.dataTypes || [];
    if (checked) {
      onChange({
        ...data,
        dataTypes: [...currentTypes, dataType]
      });
    } else {
      onChange({
        ...data,
        dataTypes: currentTypes.filter((type: string) => type !== dataType)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vendorLegalName">Vendor Legal Name</Label>
          <Input
            id="vendorLegalName"
            value={data.vendorLegalName || ""}
            onChange={(e) => handleInputChange("vendorLegalName", e.target.value)}
            placeholder="Full legal name of the vendor"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={data.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Complete business address"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            value={data.contactPerson || ""}
            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
            placeholder="Primary contact person name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={data.designation || ""}
            onChange={(e) => handleInputChange("designation", e.target.value)}
            placeholder="Job title/designation"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="contact@vendor.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+234 xxx xxx xxxx"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Does the vendor process personal data on behalf of the University?</Label>
          <RadioGroup
            value={data.processesPersonalData || ""}
            onValueChange={(value) => handleInputChange("processesPersonalData", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="processes-yes" />
              <Label htmlFor="processes-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="processes-no" />
              <Label htmlFor="processes-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label>Type of data processed:</Label>
          <div className="space-y-2">
            {["Student", "Alumni", "Research"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`data-type-${type.toLowerCase()}`}
                  checked={(data.dataTypes || []).includes(type)}
                  onCheckedChange={(checked) => handleDataTypeChange(type, checked as boolean)}
                />
                <Label htmlFor={`data-type-${type.toLowerCase()}`}>{type}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="data-type-other"
                checked={(data.dataTypes || []).includes("Other")}
                onCheckedChange={(checked) => handleDataTypeChange("Other", checked as boolean)}
              />
              <Label htmlFor="data-type-other">Other</Label>
            </div>
            {(data.dataTypes || []).includes("Other") && (
              <div className="ml-6">
                <Input
                  placeholder="Please specify..."
                  value={data.otherDataType || ""}
                  onChange={(e) => handleInputChange("otherDataType", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorInfoSection;