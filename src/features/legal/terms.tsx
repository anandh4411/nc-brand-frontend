import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to NC Brand. By accessing or using our website and services, you agree to be
              bound by these Terms & Conditions. Please read them carefully before making any
              purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Products & Pricing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All product images are representative. Actual colors may vary slightly due to display settings.</li>
              <li>Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
              <li>We reserve the right to modify prices without prior notice. The price at the time of order placement will apply.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Orders & Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Placing an order constitutes an offer to purchase. We reserve the right to accept or reject any order.</li>
              <li>Payment must be completed at the time of order via the available payment methods (Cash on Delivery, online payments when available).</li>
              <li>Orders are confirmed only after successful payment verification.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must provide accurate and complete information during registration.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, and product designs — is
              the property of NC Brand and is protected by copyright and trademark laws. Unauthorized
              use is strictly prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p>
              NC Brand shall not be liable for any indirect, incidental, or consequential damages
              arising from the use of our website or products beyond the amount paid for the
              specific product in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to
              the exclusive jurisdiction of the courts in Ernakulam, Kerala.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
            <p>
              For any questions regarding these terms, please reach out via our{" "}
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
