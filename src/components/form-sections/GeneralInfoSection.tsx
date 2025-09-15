import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GeneralInfoSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const GeneralInfoSection = ({ data, onChange }: GeneralInfoSectionProps) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="organization_name">Organization Name *</Label>
          <Input
            id="organization_name"
            value={data.organization_name || ""}
            onChange={(e) => handleChange("organization_name", e.target.value)}
            placeholder="Enter your organization name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_person">Primary Contact Person *</Label>
          <Input
            id="contact_person"
            value={data.contact_person || ""}
            onChange={(e) => handleChange("contact_person", e.target.value)}
            placeholder="Enter contact person name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email *</Label>
          <Input
            id="contact_email"
            type="email"
            value={data.contact_email || ""}
            onChange={(e) => handleChange("contact_email", e.target.value)}
            placeholder="Enter contact email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input
            id="contact_phone"
            type="tel"
            value={data.contact_phone || ""}
            onChange={(e) => handleChange("contact_phone", e.target.value)}
            placeholder="Enter contact phone number"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="service_name">Service/Product Name *</Label>
          <Input
            id="service_name"
            value={data.service_name || ""}
            onChange={(e) => handleChange("service_name", e.target.value)}
            placeholder="Enter the name of the service or product"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="service_description">Service Description *</Label>
          <Textarea
            id="service_description"
            value={data.service_description || ""}
            onChange={(e) => handleChange("service_description", e.target.value)}
            placeholder="Provide a detailed description of the service"
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label>Is this a new service or an update to an existing service? *</Label>
          <RadioGroup
            value={data.service_type || ""}
            onValueChange={(value) => handleChange("service_type", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">New Service</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing">Update to Existing Service</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Does this service process personal data? *</Label>
          <RadioGroup
            value={data.processes_personal_data || ""}
            onValueChange={(value) => handleChange("processes_personal_data", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes_personal" />
              <Label htmlFor="yes_personal">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no_personal" />
              <Label htmlFor="no_personal">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="na" id="na_personal" />
              <Label htmlFor="na_personal">Not Applicable</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Will this service have access to university systems? *</Label>
          <RadioGroup
            value={data.university_access || ""}
            onValueChange={(value) => handleChange("university_access", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes_access" />
              <Label htmlFor="yes_access">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no_access" />
              <Label htmlFor="no_access">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="na" id="na_access" />
              <Label htmlFor="na_access">Not Applicable</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoSection;