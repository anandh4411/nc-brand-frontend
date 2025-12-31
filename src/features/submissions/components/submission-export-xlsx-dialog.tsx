import { useState, useMemo, useEffect } from "react";
import { Download, AlertCircle, CheckCircle, FileSpreadsheet } from "lucide-react";
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
import { useExportBasicXlsx } from "@/api/hooks/submissions";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionExportXlsxDialog({ open, onOpenChange }: Props) {
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [phaseSearch, setPhaseSearch] = useState("");
  const [error, setError] = useState("");

  const exportXlsx = useExportBasicXlsx();

  const { data: institutionsData, isLoading: isLoadingInstitutions } = useInstitutions({
    search: institutionSearch,
    pageSize: 50,
  });

  const { data: phasesData, isLoading: isLoadingPhases } = usePhases({
    institutionId: selectedInstitution || undefined,
    search: phaseSearch || undefined,
    pageSize: 100,
  });

  const institutionOptions = useMemo(() => {
    const institutions = institutionsData?.data?.institutions;
    if (!institutions || !Array.isArray(institutions)) return [];
    return institutions.map((institution: any) => ({
      label: institution.name || "",
      value: institution.id?.toString() || "",
    }));
  }, [institutionsData]);

  const phaseOptions = useMemo(() => {
    if (!selectedInstitution) return [];
    const phases = phasesData?.data?.phases || [];
    return phases.map((phase: any) => ({
      label: phase.name || "",
      value: phase.id?.toString() || "",
    }));
  }, [phasesData, selectedInstitution]);

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
      await exportXlsx.mutateAsync({
        institutionId: Number(selectedInstitution),
        ...(selectedPhase && { phaseId: Number(selectedPhase) }),
      });
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to export XLSX");
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

  const selectedInstitutionName = useMemo(() => {
    const institution = institutionOptions.find(
      (inst) => inst.value === selectedInstitution
    );
    return institution?.label || "";
  }, [institutionOptions, selectedInstitution]);

  const selectedPhaseName = useMemo(() => {
    const phase = phaseOptions.find((p: { value: string; label: string }) => p.value === selectedPhase);
    return phase?.label || "";
  }, [phaseOptions, selectedPhase]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Export XLSX
          </DialogTitle>
          <DialogDescription>
            Select institution and optionally a phase to export submissions as an XLSX spreadsheet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-sm">Export Preview:</h4>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Institution:</span>
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
                      <span className="italic">All submissions (no phase filter)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-3 rounded-lg dark:bg-green-950/20 dark:border-green-900">
              <h4 className="font-medium text-sm mb-2 text-green-900 dark:text-green-100">
                XLSX Columns:
              </h4>
              <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                <li>• S.No</li>
                <li>• Person Name</li>
                <li>• ID Number</li>
                <li>• Institution</li>
                <li>• Login Code</li>
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

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={exportXlsx.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleExport}
            disabled={!selectedInstitution || exportXlsx.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            {exportXlsx.isPending ? "Exporting..." : "Export XLSX"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
