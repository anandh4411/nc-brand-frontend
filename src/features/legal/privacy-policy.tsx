import { Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, Smartphone, Camera, Database, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  const lastUpdated = "December 9, 2025";

  // Ensure scrolling is enabled
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#030303]/80 backdrop-blur-md border-b border-white/[0.08]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <h1 className="text-lg font-semibold">Privacy Policy</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center pb-8 border-b border-white/[0.08]">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
              Privacy Policy
            </h1>
            <p className="text-white/60">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <Section title="Introduction">
            <p>
              Welcome to Impressaa ("we," "our," or "us"). This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our mobile application
              ("Impressaa App") and related services.
            </p>
            <p>
              Impressaa is an ID card management application designed for institutions to streamline
              the process of collecting user data and photos for ID card creation. We are committed
              to protecting your privacy and ensuring the security of your personal information.
            </p>
            <p>
              By using our application, you agree to the collection and use of information in
              accordance with this policy. If you do not agree with our policies and practices,
              please do not use our application.
            </p>
          </Section>

          {/* Information We Collect */}
          <Section title="Information We Collect" icon={<Database className="h-5 w-5 text-blue-400" />}>
            <p>We collect information that you provide directly to us when using the Impressaa App:</p>

            <SubSection title="Personal Information">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Information:</strong> Name, date of birth, student/employee ID numbers</li>
                <li><strong>Contact Information:</strong> Email address, phone number, address</li>
                <li><strong>Institutional Information:</strong> Institution name, department, designation, class/section</li>
                <li><strong>Authentication Data:</strong> Login codes provided by your institution</li>
              </ul>
            </SubSection>

            <SubSection title="Media and Files">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Photographs:</strong> Photos captured through the app camera for ID card purposes</li>
                <li><strong>Document Uploads:</strong> Any supporting documents required by your institution</li>
              </ul>
            </SubSection>

            <SubSection title="Technical Information">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Device Information:</strong> Device type, operating system version</li>
                <li><strong>App Usage Data:</strong> Features accessed, form submission status</li>
                <li><strong>Network Information:</strong> IP address (for security purposes)</li>
              </ul>
            </SubSection>
          </Section>

          {/* Device Permissions */}
          <Section title="Device Permissions" icon={<Smartphone className="h-5 w-5 text-blue-400" />}>
            <p>The Impressaa App requires the following device permissions:</p>

            <PermissionCard
              icon={<Camera className="h-6 w-6 text-blue-400" />}
              title="Camera Access"
              description="Required to capture your photo for ID card creation. Photos are taken only when you actively use the camera feature within the app."
            />

            <PermissionCard
              icon={<Database className="h-6 w-6 text-blue-400" />}
              title="Storage Access"
              description="Used to temporarily store captured photos before upload and to cache app data for better performance. We do not access or collect any other files from your device."
            />

            <PermissionCard
              icon={<Smartphone className="h-6 w-6 text-blue-400" />}
              title="Internet Access"
              description="Required to communicate with our servers to submit forms, upload photos, and sync your data with your institution."
            />
          </Section>

          {/* How We Use Your Information */}
          <Section title="How We Use Your Information">
            <p>We use the collected information solely for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>App Functionality:</strong> Creating and managing your digital ID card</li>
              <li><strong>Authentication:</strong> Verifying your identity and granting access to the app</li>
              <li><strong>Account Management:</strong> Managing your profile within the system</li>
              <li><strong>Communication:</strong> Sending you updates about your submission status</li>
              <li><strong>Support:</strong> Responding to your inquiries and providing customer support</li>
            </ul>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
              <p className="text-red-300 font-medium mb-2">We do NOT use your data for:</p>
              <ul className="list-disc pl-6 space-y-1 text-white/70">
                <li>Advertising or marketing</li>
                <li>Analytics or tracking</li>
                <li>Selling to third parties</li>
              </ul>
            </div>
          </Section>

          {/* Data Sharing and Disclosure */}
          <Section title="Data Sharing and Disclosure">
            <p>We may share your information in the following circumstances:</p>

            <SubSection title="With Your Institution">
              <p>
                Your data is shared with the institution that registered you in the system.
                This includes all form submissions and photos for ID card creation purposes.
                Your institution is the data controller for information collected through their forms.
              </p>
            </SubSection>

            <SubSection title="Service Providers">
              <p>
                We may share data with trusted third-party service providers who assist us in
                operating our application, such as cloud hosting providers and printing services.
                These providers are contractually bound to protect your information.
              </p>
            </SubSection>

            <SubSection title="Legal Requirements">
              <p>
                We may disclose your information if required by law, court order, or government
                regulation, or when we believe disclosure is necessary to protect our rights,
                protect your safety or others, or investigate fraud.
              </p>
            </SubSection>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
              <p className="text-green-300 font-medium">
                We do NOT sell, trade, or rent your personal information to third parties for
                marketing purposes.
              </p>
            </div>
          </Section>

          {/* Data Security */}
          <Section title="Data Security" icon={<Lock className="h-5 w-5 text-blue-400" />}>
            <p>
              We implement appropriate technical and organizational security measures to protect
              your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption:</strong> Data is encrypted in transit using HTTPS/TLS protocols</li>
              <li><strong>Secure Storage:</strong> Personal data is stored on secure, access-controlled servers</li>
              <li><strong>Authentication:</strong> Institution-provided login codes ensure authorized access only</li>
              <li><strong>Access Controls:</strong> Only authorized personnel can access your data</li>
              <li><strong>Regular Audits:</strong> We regularly review and update our security practices</li>
            </ul>
            <p className="mt-4 text-white/60">
              While we strive to protect your information, no method of transmission over the
              internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </Section>

          {/* Data Retention */}
          <Section title="Data Retention">
            <p>We retain your personal information for as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fulfill the purposes for which it was collected (ID card creation)</li>
              <li>Comply with your institution's data retention policies</li>
              <li>Meet legal and regulatory requirements</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="mt-4">
              Typically, form submissions and photos are retained for the duration of your
              association with the institution. After this period, data may be archived or
              deleted as per institutional policies.
            </p>
          </Section>

          {/* Your Rights */}
          <Section title="Your Rights">
            <p>Depending on your location, you may have the following rights regarding your data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to institutional policies)</li>
              <li><strong>Portability:</strong> Request transfer of your data in a portable format</li>
              <li><strong>Objection:</strong> Object to processing of your data in certain circumstances</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact your institution administrator or reach
              out to us using the contact information below. Requests will be processed in
              accordance with applicable data protection laws.
            </p>
          </Section>

          {/* Children's Privacy */}
          <Section title="Children's Privacy">
            <p>
              The Impressaa App may be used by educational institutions serving minors. When
              collecting data from users under the age of 18, the following applies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data collection is initiated by the educational institution acting in loco parentis</li>
              <li>Institutions are responsible for obtaining necessary parental/guardian consent</li>
              <li>We collect only information necessary for ID card creation as specified by the institution</li>
              <li>We do not knowingly collect more information than required from minors</li>
            </ul>
          </Section>

          {/* Third-Party Services */}
          <Section title="Third-Party Services">
            <p>
              Our application may contain links to third-party websites or services. We are not
              responsible for the privacy practices of these third parties. We encourage you to
              read the privacy policies of any third-party services you access.
            </p>
          </Section>

          {/* Changes to This Policy */}
          <Section title="Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or for legal, operational, or regulatory reasons. We will notify users
              of any material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Posting the updated policy on this page with a new "Last Updated" date</li>
              <li>Sending a notification through the app (for significant changes)</li>
            </ul>
            <p className="mt-4">
              Your continued use of the application after any changes indicates your acceptance
              of the updated Privacy Policy.
            </p>
          </Section>

          {/* Contact Us */}
          <Section title="Contact Us" icon={<Mail className="h-5 w-5 text-blue-400" />}>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us:
            </p>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 mt-4 space-y-3">
              <p><strong>Impressaa</strong></p>
              <p>VI/191 A, Opp KEMHS</p>
              <p>P O Alangad, Kottappuram</p>
              <p>Ernakulam, Kerala 683511</p>
              <p>India</p>
              <p className="pt-2">
                <strong>Email:</strong>{" "}
                <a href="mailto:info.impressaa@gmail.com" className="text-blue-400 hover:text-blue-300">
                  info.impressaa@gmail.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+916238250500" className="text-blue-400 hover:text-blue-300">
                  +91 6238250500
                </a>
              </p>
            </div>
          </Section>

          {/* Agreement */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
            <p className="text-white/80">
              By using Impressaa, you agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-8 mt-8 border-t border-white/[0.08] text-center">
            <p className="text-white/40 text-sm">
              © 2025 Impressaa. All rights reserved.
            </p>
            <Link to="/" className="inline-block mt-4">
              <Button
                variant="outline"
                className="bg-white/[0.03] border-white/[0.15] text-white hover:bg-white/[0.08]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function Section({
  title,
  icon,
  children
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="text-white/70 space-y-4 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-white/90 mb-2">{title}</h3>
      <div className="text-white/70">{children}</div>
    </div>
  );
}

function PermissionCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 bg-white/[0.03] border border-white/[0.08] rounded-lg mt-4">
      <div className="flex-shrink-0 p-2 bg-blue-500/20 rounded-lg h-fit">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-white mb-1">{title}</h3>
        <p className="text-white/60 text-sm">{description}</p>
      </div>
    </div>
  );
}
