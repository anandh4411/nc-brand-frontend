import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">About NC Brand</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Our Story</h2>
            <p>
              NC Brand, formerly known as Nice Collection, was established in 1995 with a strong
              passion for quality and craftsmanship. With over 30 years of experience in the fashion
              industry, we have built a trusted name backed by a registered trademark and a legacy
              of customer satisfaction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Sourcing & Quality</h2>
            <p>
              We source premium materials directly from leading textile hubs such as Jaipur,
              Ahmedabad, and Surat, ensuring authenticity, superior fabric quality, and the latest
              trends. Our production operations are based in Ernakulam, where a team of highly
              skilled tailors and experienced supervisors work meticulously to deliver perfectly
              finished products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Our Commitment</h2>
            <p>
              At NC Brand, quality is never compromised. Every product undergoes careful supervision,
              precision stitching, and secure packaging to ensure customers receive nothing but
              excellence.
            </p>
            <p className="mt-4">
              Our collections are exclusively available through our official website and
              company-owned outlets, maintaining authenticity and brand value.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Our Vision</h2>
            <p>
              Our vision is to expand NC Brand into a globally recognized name. We aim to establish
              50 company-owned outlets and enter the international market, bringing our
              craftsmanship and quality standards to customers worldwide.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
