// src/features/admin/outlets/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { Outlet } from "@/types/dto/outlet.dto";
import { Badge } from "@/components/ui/badge";
import { Edit, ExternalLink, Eye, Trash2 } from "lucide-react";

export const createOutletColumns = (
  onView: (outlet: Outlet) => void,
  onEdit: (outlet: Outlet) => void,
  onDelete: (outlet: Outlet) => void,
  onViewProfile: (outlet: Outlet) => void
): ColumnDef<Outlet>[] => {
  const outletActions = [
    {
      label: "View Profile",
      icon: ExternalLink,
      onClick: onViewProfile,
    },
    {
      label: "View Details",
      icon: Eye,
      onClick: onView,
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: onEdit,
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      className: "text-destructive",
      separator: true,
    },
  ];

  return [
    selectColumn<Outlet>(),

    customColumn<Outlet>("code", "Code", (value) => (
      <div className="font-mono text-sm font-medium">{value || "N/A"}</div>
    )),

    customColumn<Outlet>("name", "Outlet Name", (value) => (
      <div className="font-medium max-w-[200px] truncate" title={value || ""}>
        {value || "N/A"}
      </div>
    )),

    customColumn<Outlet>("city", "City", (value) => (
      <div>{value || "N/A"}</div>
    )),

    customColumn<Outlet>("state", "State", (value) => (
      <div>{value || "N/A"}</div>
    )),

    customColumn<Outlet>("phone", "Phone", (value) => (
      <div className="font-mono text-sm">{value || "N/A"}</div>
    )),

    customColumn<Outlet>(
      "isActive",
      "Status",
      (value) => (
        <Badge variant={value ? "success" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
      { filterable: true, sortable: true }
    ),

    actionsColumn<Outlet>(outletActions),
  ];
};
