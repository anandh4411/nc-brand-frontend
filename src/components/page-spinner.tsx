import { cn } from "@/lib/utils";

interface PageSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { logo: "h-10 w-10", ring: "h-16 w-16", border: "border-[3px]" },
  md: { logo: "h-14 w-14", ring: "h-22 w-22", border: "border-[3px]" },
  lg: { logo: "h-18 w-18", ring: "h-28 w-28", border: "border-4" },
};

export function PageSpinner({ className, size = "md" }: PageSpinnerProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("flex items-center justify-center h-full w-full", className)}>
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <div
          className={cn(
            "absolute rounded-full animate-spin",
            s.ring,
            s.border,
            "border-primary/20 border-t-primary"
          )}
        />
        {/* Logo */}
        <img
          src="/logo.jpg"
          alt="Loading"
          className={cn("rounded-full object-cover", s.logo)}
        />
      </div>
    </div>
  );
}
