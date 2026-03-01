import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createCouponColumns } from "./config/columns";
import { CouponFormModal } from "./components/coupon-form-modal";
import { CouponDeleteDialog } from "./components/coupon-delete-dialog";
import { CouponViewModal } from "./components/coupon-view-modal";
import { useAdminCoupons, useDeleteCoupon } from "@/api/hooks/admin";
import type { Coupon } from "@/api/endpoints/admin";
import { toast } from "sonner";

export default function Coupons() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const { data: couponsResponse, isLoading } = useAdminCoupons();
  const deleteCoupon = useDeleteCoupon();

  const tableState = useTableState<Coupon>({ debounceMs: 300 });

  const couponList = (
    (couponsResponse?.data as any)?.coupons ||
    couponsResponse?.data ||
    []
  ) as Coupon[];

  const handleView = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setViewDialogOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditDialogOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedCoupon) return;
    deleteCoupon.mutate(selectedCoupon.uuid, {
      onSuccess: () => {
        toast.success("Coupon deleted");
        setDeleteDialogOpen(false);
        setSelectedCoupon(null);
      },
      onError: () => toast.error("Failed to delete coupon"),
    });
  };

  const columns = useMemo(
    () => createCouponColumns(handleView, handleEdit, handleDelete),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Coupons
          </h1>
          <p className="text-muted-foreground">
            Manage discount coupons for your store.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <DataTable
        data={couponList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search coupons...",
            columnKey: "code",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "createdAt", desc: true },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No coupons found.",
          filters: [
            {
              columnKey: "isActive",
              title: "Status",
              options: [
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ],
            },
            {
              columnKey: "type",
              title: "Type",
              options: [
                { label: "Percentage", value: "PERCENTAGE" },
                { label: "Fixed", value: "FIXED" },
              ],
            },
          ],
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onPaginationChange: tableState.updatePagination,
        }}
      />

      <CouponFormModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />

      {selectedCoupon && (
        <>
          <CouponViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            coupon={selectedCoupon}
          />

          <CouponFormModal
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            coupon={selectedCoupon}
            mode="edit"
          />

          <CouponDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            coupon={selectedCoupon}
            onConfirm={handleConfirmDelete}
            isDeleting={deleteCoupon.isPending}
          />
        </>
      )}
    </div>
  );
}
