import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnHeader } from "../molecules/column-header";
import { StatusBadge } from "../atoms/status-badge";

// Simple helper functions for common column types
export function selectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] ml-1"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] ml-1"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { className: "w-12 pr-4" } as any,
  };
}

export function textColumn<TData>(
  accessorKey: string,
  title: string,
  options?: {
    className?: string;
    showIcon?: boolean;
    filterable?: boolean;
    sortable?: boolean;
    customFilter?: boolean;
  }
): ColumnDef<TData> {
  return {
    accessorKey,
    header:
      options?.sortable !== false
        ? ({ column }) => <ColumnHeader column={column} title={title} />
        : title,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string;
      const icon = options?.showIcon ? (row.original as any).icon : null;

      if (icon) {
        return (
          <div className="flex items-center space-x-2">
            <span className="text-lg">{icon}</span>
            <span className={options?.className}>{value}</span>
          </div>
        );
      }

      return <div className={options?.className}>{value}</div>;
    },
    // Custom filter function for partial matches
    filterFn: options?.filterable
      ? options?.customFilter
        ? (row, id, value) => {
            const cellValue = String(row.getValue(id)).toLowerCase();
            return value.some((filterValue: string) =>
              cellValue.includes(filterValue.toLowerCase())
            );
          }
        : (row, id, value) => {
            return value.includes(row.getValue(id));
          }
      : undefined,
    meta: { title } as any,
  };
}

export function badgeColumn<TData>(
  accessorKey: string,
  title: string,
  getVariant: (value: string) => string,
  options?: {
    filterable?: boolean;
    sortable?: boolean;
  }
): ColumnDef<TData> {
  return {
    accessorKey,
    header:
      options?.sortable !== false
        ? ({ column }) => <ColumnHeader column={column} title={title} />
        : title,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string;
      const variant = getVariant(value);

      return <StatusBadge variant={variant} value={value} />;
    },
    filterFn: options?.filterable
      ? (row, id, value) => value.includes(row.getValue(id))
      : undefined,
    meta: { title } as any,
  };
}

export function customColumn<TData>(
  accessorKey: string,
  title: string,
  cellRenderer: (value: any, row: TData) => React.ReactNode,
  options?: {
    sortable?: boolean;
    filterable?: boolean;
  }
): ColumnDef<TData> {
  return {
    accessorKey,
    header:
      options?.sortable !== false
        ? ({ column }) => <ColumnHeader column={column} title={title} />
        : title,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey); // Keep as any for custom renderer
      return cellRenderer(value, row.original);
    },
    filterFn: options?.filterable
      ? (row, id, value) => {
          return value.includes(row.getValue(id));
        }
      : undefined,
    meta: { title } as any,
  };
}

export function actionsColumn<TData>(
  actions: Array<{
    label: string;
    onClick: (row: TData) => void;
    className?: string;
    icon?: LucideIcon;
    disabled?: (row: TData) => boolean;
    condition?: (row: TData) => boolean;
  }>
): ColumnDef<TData> {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const visibleActions = actions.filter(
        (action) => !action.condition || action.condition(row.original)
      );
      if (visibleActions.length === 0) return null;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {visibleActions.map((action, index) => {
              const Icon = action.icon;
              const isDisabled = action.disabled?.(row.original) ?? false;
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(row.original)}
                  className={action.className}
                  disabled={isDisabled}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}
