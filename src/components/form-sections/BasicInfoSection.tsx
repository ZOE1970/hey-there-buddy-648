import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const BasicInfoSection = ({ data, onChange }: BasicInfoSectionProps) => {
  const handleInputChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vendorName">Vendor/Third Party Name *</Label>
          <Input
            id="vendorName"
            value={data.vendorName || ""}
            onChange={(e) => handleInputChange("vendorName", e.target.value)}
            placeholder="Enter vendor/third party name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serviceProduct">Service / Product *</Label>
          <Input
            id="serviceProduct"
            value={data.serviceProduct || ""}
            onChange={(e) => handleInputChange("serviceProduct", e.target.value)}
            placeholder="Describe the service or product"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={data.date || ""}
            onChange={(e) => handleInputChange("date", e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;