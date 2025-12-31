// src/features/submissions/config/filters.ts
import {
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Layers,
} from "lucide-react";
import type { FilterConfig } from "@/components/elements/app-data-table/types";

interface FilterOption {
  value: string;
  label: string;
  icon?: any;
}

interface SubmissionFiltersParams {
  institutionOptions?: FilterOption[];
  phaseOptions?: FilterOption[];
}

export const getSubmissionFilters = (params?: SubmissionFiltersParams): FilterConfig[] => {
  const { institutionOptions = [], phaseOptions = [] } = params || {};

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
      columnKey: "institutionName",
      title: "Institution",
      options: institutionOptions,
    },
    {
      columnKey: "phaseName",
      title: "Phase",
      options: phaseOptions,
    },
  ];
};
