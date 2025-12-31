// src/features/submissions/components/submission-export-dialog.tsx
import { useState, useMemo, useEffect } from "react";
import { Download, AlertCircle, CheckCircle, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SearchableCombobox } from "@/components/searchable-combobox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInstitutions } from "@/api/hooks/institutions";
import { usePhases } from "@/api/hooks/phases";
import { useExportSubmissions } from "@/api/hooks/submissions";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionExportDialog({ open, onOpenChange }: Props) {
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [phaseSearch, setPhaseSearch] = useState("");
  const [error, setError] = useState("");

  const exportSubmissions = useExportSubmissions();

  // Fetch institutions from API
  const { data: institutionsData, isLoading: isLoadingInstitutions } = useInstitutions({
    search: institutionSearch,
    pageSize: 50,
  });

  // Fetch phases based on selected institution
  const { data: phasesData, isLoading: isLoadingPhases } = usePhases({
    institutionId: selectedInstitution || undefined,
    search: phaseSearch || undefined,
    pageSize: 100,
  });

  // Build institution options
  const institutionOptions = useMemo(() => {
    const institutions = institutionsData?.data?.institutions;
    if (!institutions || !Array.isArray(institutions)) return [];
    return institutions.map((institution: any) => ({
      label: institution.name || "",
      value: institution.id?.toString() || "",
    }));
  }, [institutionsData]);

  // Build phase options (only available after institution is selected)
  const phaseOptions = useMemo(() => {
    if (!selectedInstitution) return [];
    const phases = phasesData?.data?.phases || [];
    return phases.map((phase: any) => ({
      label: phase.name || "",
      value: phase.id?.toString() || "",
    }));
  }, [phasesData, selectedInstitution]);

  // Reset phase when institution changes
  useEffect(() => {
    setSelectedPhase("");
  }, [selectedInstitution]);

  const handleExport = async () => {
    if (!selectedInstitution) {
      setError("Please select an institution.");
      return;
    }

    setError("");

    try {
      await exportSubmissions.mutateAsync({
        institutionId: Number(selectedInstitution),
        ...(selectedPhase && { phaseId: Number(selectedPhase) }),
      });

      // Close dialog after successful export
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to export submissions");
    }
  };

  const handleClose = () => {
    setSelectedInstitution("");
    setSelectedPhase("");
    setInstitutionSearch("");
    setPhaseSearch("");
    setError("");
    onOpenChange(false);
  };

  // Get selected institution name for preview
  const selectedInstitutionName = useMemo(() => {
    const institution = institutionOptions.find(
      (inst) => inst.value === selectedInstitution
    );
    return institution?.label || "";
  }, [institutionOptions, selectedInstitution]);

  // Get selected phase name for preview
  const selectedPhaseName = useMemo(() => {
    const phase = phaseOptions.find((p: { value: string; label: string }) => p.value === selectedPhase);
    return phase?.label || "";
  }, [phaseOptions, selectedPhase]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export Submissions
          </DialogTitle>
          <DialogDescription>
            Select institution and optionally a phase to export submissions as a ZIP file
            containing XLSX data and images.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Filters */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">
                Select Institution <span className="text-destructive">*</span>
              </Label>
              <SearchableCombobox
                value={selectedInstitution}
                onValueChange={setSelectedInstitution}
                options={institutionOptions}
                placeholder="Select institution"
                searchPlaceholder="Search institutions..."
                emptyText="No institutions found."
                isLoading={isLoadingInstitutions}
                onSearch={setInstitutionSearch}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phase">Select Phase (Optional)</Label>
              <SearchableCombobox
                value={selectedPhase}
                onValueChange={setSelectedPhase}
                options={phaseOptions}
                placeholder={
                  selectedInstitution
                    ? "Select phase or leave empty for all"
                    : "Select institution first"
                }
                searchPlaceholder="Search phases..."
                emptyText={
                  selectedInstitution
                    ? "No phases found for this institution."
                    : "Select an institution first."
                }
                isLoading={isLoadingPhases}
                onSearch={setPhaseSearch}
                disabled={!selectedInstitution}
              />
            </div>
          </div>

          {/* Right Column - Export Preview */}
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-sm">Export Preview:</h4>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">
                    Institution:
                  </span>
                  <div className="mt-1">
                    {selectedInstitutionName || (
                      <span className="italic">Not selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-foreground">Phase:</span>
                  <div className="mt-1">
                    {selectedPhase ? (
                      selectedPhaseName
                    ) : (
                      <span className="italic">
                        All submissions (no phase filter)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Export Info */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2 text-blue-900">
                What will be exported:
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• XLSX file with submission data</li>
                <li>• All images associated with submissions</li>
                <li>• Packaged as a ZIP file</li>
              </ul>
            </div>

            {selectedInstitution && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Ready to export {selectedPhase ? "phase" : "all"} submissions
                  from {selectedInstitutionName}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={exportSubmissions.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleExport}
            disabled={!selectedInstitution || exportSubmissions.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            {exportSubmissions.isPending ? "Exporting..." : "Export Submissions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
