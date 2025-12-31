// src/features/phases/components/phase-form-modal.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Save } from "lucide-react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { SearchableCombobox } from "@/components/searchable-combobox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orderedStatuses, getStatusConfig } from "../config/status-config";
import { useCreatePhase, useUpdatePhase } from "@/api/hooks/phases";
import { useInstitutions } from "@/api/hooks/institutions";
import { PhaseData } from "@/types/dto/phase.dto";
import { useEffect, useMemo, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Phase name is required." }),
  description: z.string().optional(),
  institutionId: z.string().min(1, { message: "Institution is required." }),
  status: z
    .enum([
      "file-processing",
      "design-completed",
      "printing-ongoing",
      "lanyard-attachment",
      "packaging-process",
      "on-transit",
      "delivered",
    ])
    .optional()
    .or(z.literal("")),
});

type PhaseForm = z.infer<typeof formSchema>;

// Convert status configs to dropdown options
const statusOptions = orderedStatuses.map((config) => ({
  label: config.label,
  value: config.value,
}));

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase?: PhaseData | null;
  mode: "add" | "edit";
}

export function PhaseFormModal({ open, onOpenChange, phase, mode }: Props) {
  const createPhase = useCreatePhase();
  const updatePhase = useUpdatePhase();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: institutionsData, isLoading: isLoadingInstitutions } = useInstitutions({
    search: searchQuery,
    pageSize: 50,
  });

  const form = useForm<PhaseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      institutionId: "",
      status: "",
    },
  });

  const institutionOptions = useMemo(() => {
    const institutions = institutionsData?.data?.institutions;
    if (!institutions || !Array.isArray(institutions)) return [];
    return institutions.map((institution: any) => ({
      label: institution.name || "",
      value: institution.id?.toString() || "",
    }));
  }, [institutionsData]);

  useEffect(() => {
    if (open) {
      form.reset({
        name: phase?.name || "",
        description: phase?.description || "",
        institutionId: phase?.institutionId?.toString() || "",
        status: (phase?.status as any) || "",
      });
    }
  }, [phase, open, form]);

  const watchedStatus = form.watch("status");
  const isEditing = mode === "edit";

  // Get status config for description
  const currentStatusConfig = watchedStatus
    ? getStatusConfig(watchedStatus)
    : null;

  const onSubmit = async (values: PhaseForm) => {
    const currentDate = new Date().toISOString();

    // Handle status and date logic
    let statusDates: any = {};

    // CREATE MODE: Setting status for the first time
    if (!phase && values.status) {
      // If creating phase with a status, set startedAt
      statusDates.startedAt = currentDate;

      // If creating with "delivered" status, also set completedAt
      if (values.status === "delivered") {
        statusDates.completedAt = currentDate;
      }
    }

    // EDIT MODE: Updating existing phase
    if (phase && values.status) {
      // If phase had no status before (first time setting status), set startedAt
      if (!phase.status && values.status) {
        statusDates.startedAt = currentDate;
      }

      // If changing to "delivered", set completedAt (only if not already set)
      if (values.status === "delivered" && phase.status !== "delivered") {
        statusDates.completedAt = currentDate;

        // If startedAt was never set, set it now
        if (!phase.startedAt) {
          statusDates.startedAt = currentDate;
        }
      }

      // If changing from "delivered" back to any other status, we need to clear completedAt
      // Note: We'll handle this differently - by sending an explicit request to clear it
      // Backend should handle clearing completedAt when status changes from "delivered"
    }

    const payload: any = {
      name: values.name,
      description: values.description,
      institutionId: parseInt(values.institutionId),
    };

    // Only include status if it's set
    if (values.status) {
      payload.status = values.status;
    }

    // Include date updates, but only include non-null values
    if (Object.keys(statusDates).length > 0) {
      Object.keys(statusDates).forEach((key) => {
        // Only add to payload if the value is not null or undefined
        if (statusDates[key] !== null && statusDates[key] !== undefined) {
          payload[key] = statusDates[key];
        }
      });
    }

    try {
      if (mode === "add") {
        await createPhase.mutateAsync(payload);
      } else if (mode === "edit" && phase?.uuid) {
        await updatePhase.mutateAsync({
          uuid: phase.uuid,
          data: payload,
        });
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit phase:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <Edit className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            {isEditing ? "Edit Phase" : "Create New Phase"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the phase details and status below."
              : "Create a new phase to organize submissions into batches."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Content */}
        <ScrollArea className="max-h-[calc(85vh-180px)]">
          <div className="px-6 py-4">
            <Form {...form}>
              <form
                id="phase-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="institutionId"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <SearchableCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          options={institutionOptions}
                          placeholder="Select institution"
                          searchPlaceholder="Search institutions..."
                          emptyText="No institutions found."
                          isLoading={isLoadingInstitutions}
                          onSearch={setSearchQuery}
                          disabled={isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phase Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. First Batch - Grade 5A"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Status (Optional)</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select status (optional)"
                        items={statusOptions}
                      />
                      {currentStatusConfig && (
                        <FormDescription className="text-xs">
                          {currentStatusConfig.description}
                        </FormDescription>
                      )}
                      {!watchedStatus && (
                        <FormDescription className="text-xs">
                          Leave empty to set status later. StartedAt will be set when you first assign a status.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of this phase..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Show current phase info in edit mode */}
                {isEditing && phase && (
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="text-sm font-medium">
                      Current Phase Info:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">
                          Submissions:
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {phase.submissionCount}
                        </Badge>
                      </div>
                      {phase.startedAt && (
                        <div>
                          <span className="text-muted-foreground">
                            Started:
                          </span>
                          <div className="text-muted-foreground mt-1">
                            {new Date(phase.startedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      {phase.completedAt && (
                        <div>
                          <span className="text-muted-foreground">
                            Delivered:
                          </span>
                          <div className="text-muted-foreground mt-1">
                            {new Date(phase.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="phase-form">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Phase" : "Create Phase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
