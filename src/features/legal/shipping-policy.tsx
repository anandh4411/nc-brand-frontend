import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Shipping & Delivery</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Shipping Coverage</h2>
            <p>
              We currently deliver across India. International shipping is not available at this
              time but is part of our future expansion plans.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Delivery Partners</h2>
            <p>
              We work with trusted delivery partners including Delhivery, DTDC, BlueDart, and
              India Post to ensure safe and timely delivery of your orders.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Estimated Delivery Time</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Metro cities:</strong> 3-5 business days</li>
              <li><strong>Tier 2 & 3 cities:</strong> 5-7 business days</li>
              <li><strong>Remote areas:</strong> 7-10 business days</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Delivery times are estimates and may vary due to unforeseen circumstances such
              as weather, holidays, or logistics delays.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Shipping Charges</h2>
            <p>
              Shipping charges, if applicable, will be displayed at checkout before you place
              your order. We may offer free shipping on orders above a certain value — check
              the checkout page for current offers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Order Tracking</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Once your order is shipped, you will receive the tracking ID and delivery provider details.</li>
              <li>You can track your order from the Order History page in your account.</li>
              <li>A direct tracking link is provided where available.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Undelivered Orders</h2>
            <p>
              If a delivery attempt fails, the courier will make up to 2 additional attempts.
              If the package is returned to us, we will contact you to arrange re-delivery or
              process a refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Contact</h2>
            <p>
              For shipping-related queries, reach out via our{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact Us
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
