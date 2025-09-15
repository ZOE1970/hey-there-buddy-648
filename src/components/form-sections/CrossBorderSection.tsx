import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface CrossBorderSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const CrossBorderSection = ({ data, onChange }: CrossBorderSectionProps) => {
  const handleResponseChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const questions = [
    {
      key: "dataTransferOutsideNigeria",
      text: "Does the vendor transfer personal data outside Nigeria?"
    },
    {
      key: "ndpaAdequacyProvisions",
      text: "If yes, are NDPA adequacy provisions met (adequacy decision, binding contracts, or other safeguards)?"
    },
    {
      key: "contractualSafeguards",
      text: "Are there contractual safeguards (e.g. Standard Contractual Clauses) for transfers?"
    },
    {
      key: "cloudProviderCompliance",
      text: "Is data hosted with reputable cloud providers who meet global compliance standards (ISO 27001, GDPR compliance, etc.)?"
    }
  ];

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.key} className="space-y-3 p-4 border rounded-lg">
          <Label className="text-sm font-medium">{index + 1}. {question.text}</Label>
          <RadioGroup
            value={data[question.key] || ""}
            onValueChange={(value) => handleResponseChange(question.key, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${question.key}-yes`} />
              <Label htmlFor={`${question.key}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${question.key}-no`} />
              <Label htmlFor={`${question.key}-no`}>No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="na" id={`${question.key}-na`} />
              <Label htmlFor={`${question.key}-na`}>N/A</Label>
            </div>
          </RadioGroup>
          <div className="mt-2">
            <Label className="text-xs text-muted-foreground">Comments (optional):</Label>
            <Textarea
              placeholder="Add any comments or supporting information..."
              value={data[`${question.key}_comments`] || ""}
              onChange={(e) => handleResponseChange(`${question.key}_comments`, e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CrossBorderSection;