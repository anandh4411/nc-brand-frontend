// src/features/submissions/components/submission-add-to-phase-dialog.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers, Save, Search, Users } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { SearchableCombobox } from "@/components/searchable-combobox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubmissionData } from "@/types/dto/submission.dto";
import { usePhases } from "@/api/hooks/phases";
import { useAddSubmissionsToPhase } from "@/api/hooks/submissions";
import { useMemo, useState } from "react";

const formSchema = z.object({
  phaseId: z.string().min(1, { message: "Phase is required." }),
});

type AddToPhaseForm = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissions: SubmissionData[];
}

export function SubmissionAddToPhaseDialog({
  open,
  onOpenChange,
  submissions,
}: Props) {
  const [phaseSearch, setPhaseSearch] = useState("");
  const addToPhase = useAddSubmissionsToPhase();

  const form = useForm<AddToPhaseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phaseId: "",
    },
  });

  const isBulkOperation = submissions.length > 1;
  const singleSubmission = submissions.length === 1 ? submissions[0] : null;

  // For bulk operations, check if all submissions are from the same institution
  const institutionIds = [...new Set(submissions.map((s) => s.institutionId))];
  const isMixedInstitutions = institutionIds.length > 1;

  // Get institutionId from first submission (all should be same after validation)
  const institutionId = submissions.length > 0 ? submissions[0].institutionId?.toString() : undefined;

  // Fetch phases for the institution
  const { data: phasesData, isLoading: isLoadingPhases } = usePhases({
    institutionId,
    search: phaseSearch || undefined,
    pageSize: 50,
  });

  // Build phase options from API response
  const availablePhases = useMemo(() => {
    if (isMixedInstitutions) return [];
    const phases = phasesData?.data?.phases || [];
    return phases.map((phase: any) => ({
      label: phase.name || "",
      value: phase.uuid || "",
      status: phase.status || "",
      submissionCount: phase.submissionCount || 0,
    }));
  }, [phasesData, isMixedInstitutions]);

  const selectedPhaseId = form.watch("phaseId");
  const selectedPhase = availablePhases.find(
    (p: any) => p.value === selectedPhaseId
  );

  // Group submissions by institution for display
  const submissionsByInstitution = submissions.reduce((acc, submission) => {
    const key = submission.institutionName || 'Unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(submission);
    return acc;
  }, {} as Record<string, SubmissionData[]>);

  const onSubmit = async (values: AddToPhaseForm) => {
    if (submissions.length === 0) return;

    // Extract UUIDs from submissions (filter out undefined)
    const submissionUuids = submissions
      .map((s) => s.uuid)
      .filter((uuid): uuid is string => uuid !== undefined);

    try {
      await addToPhase.mutateAsync({
        submissionUuids,
        phaseUuid: values.phaseId,
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to add submissions to phase:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (submissions.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            {isBulkOperation ? "Bulk Add to Phase" : "Add to Phase"}
          </DialogTitle>
          <DialogDescription>
            {isBulkOperation
              ? `Assign ${submissions.length} submissions to a phase for better organization.`
              : "Assign this submission to a phase for better organization."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Submissions Summary */}
          <div className="bg-muted/50 p-3 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium text-sm">
                {isBulkOperation
                  ? `Selected Submissions (${submissions.length})`
                  : "Submission Details"}
              </span>
            </div>

            {isBulkOperation ? (
              <div className="space-y-3">
                {/* Summary by institution - count only */}
                <div className="space-y-2">
                  {Object.entries(submissionsByInstitution).map(
                    ([institution, subs]) => (
                      <div
                        key={institution}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{institution}</span>
                        <Badge variant="secondary" className="text-xs">
                          {subs.length} submission{subs.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    )
                  )}
                </div>

                {/* Mixed institutions warning */}
                {isMixedInstitutions && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800 text-sm">
                      You have selected submissions from multiple institutions.
                      Please select submissions from the same institution to
                      assign them to a phase.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              singleSubmission && (
                <div className="space-y-1">
                  <div className="flex items-start justify-between text-sm gap-2">
                    <span className="text-muted-foreground shrink-0">
                      Person:
                    </span>
                    <span className="font-medium text-right break-words">
                      {singleSubmission.personName}
                    </span>
                  </div>
                  <div className="flex items-start justify-between text-sm gap-2">
                    <span className="text-muted-foreground shrink-0">
                      Institution:
                    </span>
                    <span className="text-xs text-right break-words">
                      {singleSubmission.institutionName}
                    </span>
                  </div>
                  {singleSubmission.category && (
                    <div className="flex items-start justify-between text-sm gap-2">
                      <span className="text-muted-foreground shrink-0">
                        Category:
                      </span>
                      <span className="text-xs text-right break-words">
                        {singleSubmission.category}
                      </span>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Show alert if no phases available */}
          {availablePhases.length === 0 && !isMixedInstitutions ? (
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>
                No phases are available for this institution. Create a phase
                first before assigning submissions.
              </AlertDescription>
            </Alert>
          ) : !isMixedInstitutions ? (
            <Form {...form}>
              <form
                id="add-to-phase-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="phaseId"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Select Phase</FormLabel>
                      <FormControl>
                        <SearchableCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          options={availablePhases.map((phase: any) => ({
                            label: phase.label,
                            value: phase.value,
                          }))}
                          placeholder="Search and select phase..."
                          searchPlaceholder="Search phases..."
                          emptyText="No phases found."
                          isLoading={isLoadingPhases}
                          onSearch={setPhaseSearch}
                        />
                      </FormControl>
                      <FormMessage />

                      {selectedPhase && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <div className="break-words">
                            <strong>Full name:</strong> {selectedPhase.label}
                          </div>
                          <div className="mt-1">
                            {selectedPhase.status} •{" "}
                            {selectedPhase.submissionCount} submissions
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Selected Phase Info Card */}
                {selectedPhase && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-2">
                    <div className="font-medium text-sm text-blue-900">
                      Selected Phase:
                    </div>
                    <div className="text-sm text-blue-800 break-words">
                      {selectedPhase.label}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedPhase.status && (
                        <Badge variant="outline" className="text-xs">
                          {selectedPhase.status.replace("-", " ")}
                        </Badge>
                      )}
                      <span className="text-xs text-blue-600">
                        {selectedPhase.submissionCount} submissions
                      </span>
                    </div>
                  </div>
                )}

                {/* Warning for delivered phases */}
                {selectedPhase?.status === "delivered" && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800 text-sm">
                      Note: This phase is marked as delivered. You can still add
                      {isBulkOperation
                        ? ` ${submissions.length} submissions`
                        : " this submission"}
                      , but consider if this is the right phase.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </Form>
          ) : null}
        </div>

        <DialogFooter className="gap-y-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="add-to-phase-form"
            disabled={availablePhases.length === 0 || isMixedInstitutions || addToPhase.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {addToPhase.isPending
              ? "Adding..."
              : isBulkOperation
              ? `Add ${submissions.length} to Phase`
              : "Add to Phase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
