import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface DataSubjectRightsSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const DataSubjectRightsSection = ({ data, onChange }: DataSubjectRightsSectionProps) => {
  const handleResponseChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const rightsQuestions = [
    {
      key: "accessToData",
      text: "Access to personal data"
    },
    {
      key: "correctionRectification",
      text: "Correction/rectification of data"
    },
    {
      key: "erasureRightForgotten",
      text: "Erasure (right to be forgotten)"
    },
    {
      key: "objectionProcessing",
      text: "Objection to processing"
    },
    {
      key: "dataPortability",
      text: "Data portability"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-medium">Can the vendor support requests for:</Label>
        
        {rightsQuestions.map((question, index) => (
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
        
        <div className="space-y-3 p-4 border rounded-lg">
          <Label className="text-sm font-medium">6. Does the vendor have a process to forward rights requests to the University within a defined timeline (7 days)?</Label>
          <RadioGroup
            value={data.forwardRightsRequests || ""}
            onValueChange={(value) => handleResponseChange("forwardRightsRequests", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="forward-yes" />
              <Label htmlFor="forward-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="forward-no" />
              <Label htmlFor="forward-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="na" id="forward-na" />
              <Label htmlFor="forward-na">N/A</Label>
            </div>
          </RadioGroup>
          <div className="mt-2">
            <Label className="text-xs text-muted-foreground">Comments (optional):</Label>
            <Textarea
              placeholder="Add any comments or supporting information..."
              value={data.forwardRightsRequests_comments || ""}
              onChange={(e) => handleResponseChange("forwardRightsRequests_comments", e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSubjectRightsSection;