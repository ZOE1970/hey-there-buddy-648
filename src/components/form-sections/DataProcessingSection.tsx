import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface DataProcessingSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const DataProcessingSection = ({ data, onChange }: DataProcessingSectionProps) => {
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

  const dataTypes = [
    "Student Records",
    "Employee Information", 
    "Financial Data",
    "Health Records",
    "Research Data",
    "Email Addresses",
    "Phone Numbers",
    "Addresses",
    "Social Security Numbers",
    "Other Identification Numbers"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>What types of personal data will be processed? (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={(data.data_types || []).includes(type)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("data_types", type, checked as boolean)
                  }
                />
                <Label htmlFor={type} className="text-sm font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_purpose">Purpose of data processing *</Label>
          <Textarea
            id="data_purpose"
            value={data.data_purpose || ""}
            onChange={(e) => handleChange("data_purpose", e.target.value)}
            placeholder="Describe the purpose and legal basis for processing personal data"
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Label>Where will the data be stored? *</Label>
          <RadioGroup
            value={data.data_location || ""}
            onValueChange={(value) => handleChange("data_location", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="us" id="us" />
              <Label htmlFor="us">United States</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="eu" id="eu" />
              <Label htmlFor="eu">European Union</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other (please specify in comments)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>How long will the data be retained? *</Label>
          <RadioGroup
            value={data.data_retention || ""}
            onValueChange={(value) => handleChange("data_retention", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1year" id="1year" />
              <Label htmlFor="1year">Less than 1 year</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3years" id="3years" />
              <Label htmlFor="3years">1-3 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5years" id="5years" />
              <Label htmlFor="5years">3-5 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="longer" id="longer" />
              <Label htmlFor="longer">More than 5 years</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Will data be shared with third parties? *</Label>
          <RadioGroup
            value={data.third_party_sharing || ""}
            onValueChange={(value) => handleChange("third_party_sharing", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes_sharing" />
              <Label htmlFor="yes_sharing">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no_sharing" />
              <Label htmlFor="no_sharing">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="na" id="na_sharing" />
              <Label htmlFor="na_sharing">Not Applicable</Label>
            </div>
          </RadioGroup>
        </div>

        {data.third_party_sharing === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="third_party_details">Third Party Sharing Details</Label>
            <Textarea
              id="third_party_details"
              value={data.third_party_details || ""}
              onChange={(e) => handleChange("third_party_details", e.target.value)}
              placeholder="Please provide details about third party data sharing"
              rows={3}
            />
          </div>
        )}

        <div className="space-y-3">
          <Label>Does your organization have a Data Protection Officer (DPO)? *</Label>
          <RadioGroup
            value={data.has_dpo || ""}
            onValueChange={(value) => handleChange("has_dpo", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes_dpo" />
              <Label htmlFor="yes_dpo">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no_dpo" />
              <Label htmlFor="no_dpo">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="na" id="na_dpo" />
              <Label htmlFor="na_dpo">Not Applicable</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default DataProcessingSection;