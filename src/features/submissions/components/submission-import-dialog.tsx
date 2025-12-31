// src/features/submissions/components/submission-import-dialog.tsx
import { useState, useRef, useMemo } from "react";
import { FileText, AlertCircle, CheckCircle, Download, AlertTriangle, Users, RefreshCw } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableCombobox } from "@/components/searchable-combobox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInstitutions } from "@/api/hooks/institutions";
import { useImportSubmissionsCSV } from "@/api/hooks/submissions";
import type { BulkImportResult, BulkImportWarning, DuplicateAction } from "@/types/dto/submission.dto";
import { ScrollArea } from "@/components/ui/scroll-area";

type ImportStep = 'idle' | 'uploading' | 'column-warning' | 'duplicate-warning' | 'success';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionImportDialog({ open, onOpenChange }: Props) {
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [warning, setWarning] = useState<BulkImportWarning | null>(null);
  const [step, setStep] = useState<ImportStep>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importCSV = useImportSubmissionsCSV();

  // Fetch institutions from API
  const { data: institutionsData, isLoading: isLoadingInstitutions } = useInstitutions({
    search: institutionSearch,
    pageSize: 50,
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (CSV or XLSX)
    const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");
    const isXLSX = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.name.endsWith(".xlsx");

    if (!isCSV && !isXLSX) {
      setError("Please select a valid CSV or XLSX file.");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setCsvFile(file);
    setError("");
    setImportResult(null);
    setWarning(null);
  };

  const handleImport = async (force = false, duplicateAction?: DuplicateAction) => {
    if (!selectedInstitution) {
      setError("Please select an institution.");
      return;
    }

    if (!csvFile) {
      setError("Please upload a valid file.");
      return;
    }

    setError("");
    setStep('uploading');

    try {
      const response = await importCSV.mutateAsync({
        institutionId: Number(selectedInstitution),
        file: csvFile,
        force,
        duplicateAction,
      });

      const result = response.data;

      // Check if there's a warning requiring user action
      if (result.warning) {
        setWarning(result.warning);

        if (result.warning.type === 'UNMATCHED_FIELDS' || result.warning.type === 'NO_FORM') {
          setStep('column-warning');
          return;
        }

        if (result.warning.type === 'DUPLICATE_IDS') {
          setStep('duplicate-warning');
          return;
        }
      }

      // Success - no warnings
      setWarning(null);
      setImportResult(result);
      setStep('success');

      // If completely successful, close dialog after delay
      if (result.failedCount === 0 && result.successCount > 0) {
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to import file");
      setStep('idle');
    }
  };

  const handleForceImport = () => {
    handleImport(true);
  };

  const handleDuplicateAction = (action: DuplicateAction) => {
    handleImport(true, action);
  };

  const handleClose = () => {
    setSelectedInstitution("");
    setInstitutionSearch("");
    setCsvFile(null);
    setError("");
    setImportResult(null);
    setWarning(null);
    setStep('idle');
    onOpenChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelWarning = () => {
    setWarning(null);
    setStep('idle');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import People from File
          </DialogTitle>
          <DialogDescription>
            Select an institution and upload a CSV or XLSX file to import people and
            generate login codes automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Institution Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Select Institution</Label>
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

            {/* Requirements Info */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">File Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Supported formats: CSV, XLSX</li>
                <li>• First row must contain headers</li>
                <li>
                  • <strong>Required:</strong> Person Name, Id Number
                </li>
                <li>
                  • <strong>Optional:</strong> Class
                </li>
                <li>• Extra columns mapped to form fields</li>
                <li>• Max file size: 5MB</li>
              </ul>
            </div>
          </div>

          {/* Right Column - File Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">Upload File</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6">
                <div className="text-center space-y-3">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={importCSV.isPending}
                    >
                      {importCSV.isPending ? "Uploading..." : "Choose File"}
                    </Button>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {csvFile ? (
                      <span className="font-medium">{csvFile.name}</span>
                    ) : (
                      "Select a CSV or XLSX file"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* File Status */}
            {csvFile && !error && !importResult && !warning && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{csvFile.name}</strong> selected. Click Import to upload.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Column Mismatch Warning */}
        {step === 'column-warning' && warning && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="flex flex-col gap-3">
              <div>
                <strong className="text-amber-700 dark:text-amber-300">Warning:</strong>{" "}
                {warning.message}
              </div>
              {warning.unmatchedColumns && warning.unmatchedColumns.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Unmatched columns:</span>{" "}
                  {warning.unmatchedColumns.join(", ")}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelWarning}
                  disabled={importCSV.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleForceImport}
                  disabled={importCSV.isPending}
                >
                  {importCSV.isPending ? "Importing..." : "Continue Anyway"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Proceeding will import only basic fields (Person Name, Id Number, Class).
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Duplicate IDs Warning */}
        {step === 'duplicate-warning' && warning && (
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="flex flex-col gap-3">
              <div>
                <strong className="text-blue-700 dark:text-blue-300">Duplicates Found:</strong>{" "}
                {warning.message}
              </div>
              <div className="text-sm flex gap-4">
                <span>
                  <strong>{warning.duplicateCount}</strong> existing records
                </span>
                <span>
                  <strong>{warning.newCount}</strong> new records
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicateAction('skip')}
                  disabled={importCSV.isPending}
                  className="justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {importCSV.isPending ? "Importing..." : `Skip Duplicates (Import ${warning.newCount} new)`}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDuplicateAction('replace')}
                  disabled={importCSV.isPending}
                  className="justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {importCSV.isPending ? "Importing..." : `Replace All (${(warning.duplicateCount || 0) + (warning.newCount || 0)} records)`}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelWarning}
                  disabled={importCSV.isPending}
                >
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Import Result */}
        {step === 'success' && importResult && (
          <div className="space-y-3">
            {importResult.failedCount === 0 ? (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription>
                  <strong>Success!</strong> All {importResult.successCount} submissions
                  imported successfully.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription>
                    Imported {importResult.successCount} of {importResult.totalRows}{" "}
                    submissions. {importResult.failedCount} failed.
                  </AlertDescription>
                </Alert>

                {/* Error Details */}
                {importResult.errors.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2">Failed Rows:</h4>
                    <ScrollArea className="h-32">
                      <div className="space-y-2 text-sm">
                        {importResult.errors.map((error, index) => (
                          <div key={index} className="text-muted-foreground">
                            <span className="font-medium">Row {error.row}:</span>{" "}
                            {error.personName && (
                              <span className="italic">{error.personName}</span>
                            )}{" "}
                            {error.idNumber && (
                              <span className="italic">({error.idNumber})</span>
                            )}{" "}
                            - {error.reason}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Error Alert - Full Width */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={importCSV.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleImport()}
            disabled={
              !selectedInstitution ||
              !csvFile ||
              importCSV.isPending ||
              step === 'column-warning' ||
              step === 'duplicate-warning' ||
              step === 'success'
            }
          >
            {importCSV.isPending && step === 'uploading' ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
