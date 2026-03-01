import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createOfferColumns } from "./config/columns";
import { OfferFormModal } from "./components/offer-form-modal";
import { OfferDeleteDialog } from "./components/offer-delete-dialog";
import { OfferViewModal } from "./components/offer-view-modal";
import { useAdminOffers, useDeleteOffer } from "@/api/hooks/admin";
import type { Offer } from "@/api/endpoints/admin";
import { toast } from "sonner";

export default function Offers() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const { data: offersResponse, isLoading } = useAdminOffers();
  const deleteOffer = useDeleteOffer();

  const tableState = useTableState<Offer>({ debounceMs: 300 });

  const offerList = (
    (offersResponse?.data as any)?.offers ||
    offersResponse?.data ||
    []
  ) as Offer[];

  const handleView = (offer: Offer) => {
    setSelectedOffer(offer);
    setViewDialogOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setEditDialogOpen(true);
  };

  const handleDelete = (offer: Offer) => {
    setSelectedOffer(offer);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedOffer) return;
    deleteOffer.mutate(selectedOffer.uuid, {
      onSuccess: () => {
        toast.success("Offer deleted");
        setDeleteDialogOpen(false);
        setSelectedOffer(null);
      },
      onError: () => toast.error("Failed to delete offer"),
    });
  };

  const columns = useMemo(
    () => createOfferColumns(handleView, handleEdit, handleDelete),
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
            Offers
          </h1>
          <p className="text-muted-foreground">
            Manage buy-X-get-Y offers and product assignments.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Offer
        </Button>
      </div>

      <DataTable
        data={offerList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search offers...",
            columnKey: "name",
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
          emptyStateMessage: "No offers found.",
          filters: [
            {
              columnKey: "isActive",
              title: "Status",
              options: [
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
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

      <OfferFormModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />

      {selectedOffer && (
        <>
          <OfferViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            offer={selectedOffer}
          />

          <OfferFormModal
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            offer={selectedOffer}
            mode="edit"
          />

          <OfferDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            offer={selectedOffer}
            onConfirm={handleConfirmDelete}
            isDeleting={deleteOffer.isPending}
          />
        </>
      )}
    </div>
  );
}
