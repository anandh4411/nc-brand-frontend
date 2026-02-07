import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

function OutletSales() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales / POS</h1>
        <p className="text-muted-foreground">
          Point of Sale system for in-store transactions
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground text-center max-w-md">
            The Point of Sale system is under development. This feature will
            allow you to process in-store sales, manage transactions, and track
            daily revenue.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/outlet/sales/")({
  component: OutletSales,
});
