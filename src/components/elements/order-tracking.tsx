import { motion } from "framer-motion";
import {
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  PackageCheck,
  Clock,
  AlertCircle,
  RotateCcw,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export type TrackingStatus =
  | "order_placed"
  | "confirmed"
  | "processing"
  | "picked_up"
  | "in_transit"
  | "reached_hub"
  | "out_for_delivery"
  | "delivered"
  | "attempt_failed"
  | "rto_initiated"
  | "returned"
  | "cancelled";

export type CourierProvider = "bluedart" | "delhivery" | "ecom_express" | "dtdc" | "unknown";

export interface TrackingEvent {
  id: string;
  status: TrackingStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
}

export interface ShipmentTracking {
  awbNumber: string;
  courier: CourierProvider;
  courierName: string;
  estimatedDelivery?: string;
  currentStatus: TrackingStatus;
  events: TrackingEvent[];
}

// ============================================================================
// STATUS CONFIG
// ============================================================================

const statusConfig: Record<
  TrackingStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  order_placed: {
    label: "Order Placed",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-950",
  },
  picked_up: {
    label: "Picked Up",
    icon: PackageCheck,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-950",
  },
  in_transit: {
    label: "In Transit",
    icon: Truck,
    color: "text-violet-600",
    bgColor: "bg-violet-100 dark:bg-violet-950",
  },
  reached_hub: {
    label: "Reached Hub",
    icon: MapPin,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: Truck,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-950",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
  attempt_failed: {
    label: "Delivery Attempted",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
  rto_initiated: {
    label: "Return Initiated",
    icon: RotateCcw,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
  returned: {
    label: "Returned",
    icon: RotateCcw,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
  cancelled: {
    label: "Cancelled",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
};

// Progress stepper stages (simplified view)
const PROGRESS_STAGES: TrackingStatus[] = [
  "order_placed",
  "confirmed",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

// ============================================================================
// HELPERS
// ============================================================================

function getStageIndex(status: TrackingStatus): number {
  const mapping: Record<TrackingStatus, number> = {
    order_placed: 0,
    confirmed: 1,
    processing: 1,
    picked_up: 2,
    in_transit: 3,
    reached_hub: 3,
    out_for_delivery: 4,
    delivered: 5,
    attempt_failed: 4,
    rto_initiated: -1,
    returned: -1,
    cancelled: -1,
  };
  return mapping[status] ?? -1;
}

function formatTrackingDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTrackingTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getCourierTrackingUrl(courier: CourierProvider, awb: string): string | null {
  switch (courier) {
    case "bluedart":
      return `https://www.bluedart.com/tracking/${awb}`;
    case "delhivery":
      return `https://www.delhivery.com/track/package/${awb}`;
    case "ecom_express":
      return `https://ecomexpress.in/tracking/?awb_field=${awb}`;
    case "dtdc":
      return `https://www.dtdc.in/tracking.asp?strCnno=${awb}`;
    default:
      return null;
  }
}

// ============================================================================
// PROGRESS STEPPER (Horizontal)
// ============================================================================

function ProgressStepper({ currentStatus }: { currentStatus: TrackingStatus }) {
  const activeIndex = getStageIndex(currentStatus);
  const isException = activeIndex === -1;

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-[500px]">
        {PROGRESS_STAGES.map((stage, index) => {
          const config = statusConfig[stage];
          const Icon = config.icon;
          const isCompleted = !isException && index < activeIndex;
          const isCurrent = !isException && index === activeIndex;
          const isPending = isException || index > activeIndex;

          return (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              {/* Step */}
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors duration-300",
                    isCompleted && "bg-green-600 border-green-600 text-white",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    isPending && "border-muted-foreground/30 bg-muted text-muted-foreground/50"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-[11px] font-medium text-center whitespace-nowrap",
                    isCompleted && "text-green-600",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground/60"
                  )}
                >
                  {config.label}
                </span>
              </div>

              {/* Connector line */}
              {index < PROGRESS_STAGES.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 relative mt-[-18px]">
                  <div className="absolute inset-0 bg-muted-foreground/20 rounded-full" />
                  {!isException && index < activeIndex && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="absolute inset-0 bg-green-600 rounded-full origin-left"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exception badge */}
      {isException && (
        <div className="mt-3 flex justify-center">
          <Badge variant="destructive" className="text-xs">
            {statusConfig[currentStatus]?.label || currentStatus}
          </Badge>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TIMELINE EVENT
// ============================================================================

function TimelineEvent({
  event,
  isFirst,
  isLast,
}: {
  event: TrackingEvent;
  isFirst: boolean;
  isLast: boolean;
}) {
  const config = statusConfig[event.status];
  const Icon = config?.icon || Package;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3"
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
            isFirst ? config?.bgColor : "bg-muted"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4",
              isFirst ? config?.color : "text-muted-foreground"
            )}
          />
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-[32px] bg-border" />
        )}
      </div>

      {/* Content */}
      <div className={cn("pb-6", isLast && "pb-0")}>
        <p
          className={cn(
            "text-sm font-medium leading-tight",
            isFirst ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {event.title}
        </p>
        {event.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {event.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground/70">
          <span>
            {formatTrackingDate(event.timestamp)}, {formatTrackingTime(event.timestamp)}
          </span>
          {event.location && (
            <>
              <span>&middot;</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {event.location}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface OrderTrackingProps {
  tracking: ShipmentTracking;
  className?: string;
}

export function OrderTracking({ tracking, className }: OrderTrackingProps) {
  const trackingUrl = getCourierTrackingUrl(tracking.courier, tracking.awbNumber);

  const copyAwb = () => {
    navigator.clipboard.writeText(tracking.awbNumber);
    toast.success("AWB number copied");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Courier & AWB Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Shipment Tracking</CardTitle>
            <Badge
              variant="outline"
              className={cn(
                "capitalize text-xs",
                statusConfig[tracking.currentStatus]?.color
              )}
            >
              {statusConfig[tracking.currentStatus]?.label || tracking.currentStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Courier details */}
          <div className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Courier Partner</p>
              <p className="text-sm font-medium">{tracking.courierName}</p>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-xs text-muted-foreground">AWB / Tracking No.</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-mono font-medium">
                  {tracking.awbNumber}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={copyAwb}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* EDD */}
          {tracking.estimatedDelivery && tracking.currentStatus !== "delivered" && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/15 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-sm">
                <span className="text-muted-foreground">Expected delivery: </span>
                <span className="font-medium">
                  {formatTrackingDate(tracking.estimatedDelivery)}
                </span>
              </p>
            </div>
          )}

          {/* Progress stepper */}
          <ProgressStepper currentStatus={tracking.currentStatus} />
        </CardContent>
      </Card>

      {/* Detailed Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Tracking Details</CardTitle>
            {trackingUrl && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                  Track on {tracking.courierName}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="space-y-0">
            {tracking.events.map((event, index) => (
              <TimelineEvent
                key={event.id}
                event={event}
                isFirst={index === 0}
                isLast={index === tracking.events.length - 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
