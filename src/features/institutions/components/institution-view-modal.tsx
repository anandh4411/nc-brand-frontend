// src/features/institutions/components/institution-view-modal.tsx
import {
  Eye,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Activity,
  Key,
  Copy,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstitutionData } from "@/types/dto/institution.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  institution: InstitutionData | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  return status === "active" ? "default" : "secondary";
};

const getTypeLabel = (type: string) => {
  const typeLabels = {
    school: "School",
    office: "Office",
    organization: "Organization",
    other: "Other",
  } as const;
  return typeLabels[type as keyof typeof typeLabels] || type;
};

export function InstitutionViewModal({
  open,
  onOpenChange,
  institution,
}: Props) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  if (!institution) return null;

  const handleCopyLink = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied to clipboard!`);
      setTimeout(() => setCopySuccess(null), 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopySuccess("Failed to copy to clipboard");
      setTimeout(() => setCopySuccess(null), 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Institution Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{institution.name || "N/A"}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    {getTypeLabel(institution.type || "")}
                  </Badge>
                  <Badge
                    variant={institution.isAccessActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    {institution.isAccessActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Address */}
            {institution.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.address}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Institution Code */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Key className="h-4 w-4" />
              Institution Code
            </h4>

            {/* Success Message */}
            {copySuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-md text-sm">
                {copySuccess}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Code (use for institution login):
              </label>
              <div className="flex gap-2">
                <Input
                  value={institution.institutionCode}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleCopyLink(
                      institution.institutionCode || "",
                      "Institution Code"
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact Information</h4>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.contactPerson}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.contactPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.contactEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          {/* TODO: Add createdAt and updatedAt fields to backend DTO */}
          {/* <div className="space-y-3">
            <h4 className="text-sm font-semibold">System Information</h4>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {formatDate(institution.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {formatDate(institution.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
