// src/features/submissions/config/institution-filters.ts
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { FilterConfig } from "@/components/elements/app-data-table/types";

interface FilterOption {
  value: string;
  label: string;
  icon?: any;
}

interface InstitutionSubmissionFiltersParams {
  phaseOptions?: FilterOption[];
}

export const getInstitutionSubmissionFilters = (
  params?: InstitutionSubmissionFiltersParams
): FilterConfig[] => {
  const { phaseOptions = [] } = params || {};

  return [
    {
      columnKey: "status",
      title: "Status",
      options: [
        { value: "pending", label: "Pending", icon: Clock },
        { value: "submitted", label: "Submitted", icon: CheckCircle },
        { value: "expired", label: "Expired", icon: XCircle },
      ],
    },
    {
      columnKey: "phaseName",
      title: "Phase",
      options: phaseOptions,
    },
  ];
};
