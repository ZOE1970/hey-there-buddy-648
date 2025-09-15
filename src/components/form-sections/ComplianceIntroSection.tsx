import { Label } from "@/components/ui/label";

interface ComplianceIntroSectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const ComplianceIntroSection = ({ data, onChange }: ComplianceIntroSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Vendor Compliance Checklist</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Instructions:</strong> For each item in the following sections, please select:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Yes</strong> - The requirement is fully met</li>
            <li><strong>No</strong> - The requirement is not met</li>
            <li><strong>N/A (Not Applicable)</strong> - The requirement does not apply to your service</li>
          </ul>
          <p className="mt-3">Please provide comments or attach supporting documents where applicable.</p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceIntroSection;