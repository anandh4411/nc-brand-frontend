import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Refund & Cancellation Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Order Cancellation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Orders can be cancelled before they are shipped. Once shipped, cancellation is not possible.</li>
              <li>To cancel an order, go to your Order History and click "Cancel Order", or contact our support team.</li>
              <li>Cancelled orders with online payment will be refunded within 5-7 business days to the original payment method.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Returns</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We accept returns within 7 days of delivery for products in unused, original condition with tags intact.</li>
              <li>Items that are worn, washed, altered, or damaged by the customer are not eligible for return.</li>
              <li>To initiate a return, contact us via our <Link to="/shop/contact" className="text-primary hover:underline">Contact Us</Link> page with your order number and reason for return.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Refund Process</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refunds are processed after the returned product is received and inspected.</li>
              <li>Approved refunds will be credited within 7-10 business days.</li>
              <li>Shipping charges are non-refundable unless the return is due to a defective or incorrect product.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Damaged or Defective Products</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you receive a damaged or defective product, contact us within 48 hours of delivery.</li>
              <li>Please share photos of the damaged product and packaging for verification.</li>
              <li>We will arrange a free pickup and provide a full refund or replacement.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Non-Returnable Items</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Products purchased during sale or with discount coupons (unless defective)</li>
              <li>Customized or made-to-order items</li>
              <li>Innerwear and undergarments (for hygiene reasons)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Contact</h2>
            <p>
              For refund or return queries, reach out via our{" "}
              <Link to="/shop/contact" className="text-primary hover:underline">
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
