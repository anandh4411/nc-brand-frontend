import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";

function InstitutionsIndex() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/institutions/dashboard" />;
  }

  return <Navigate to="/institutions/login" />;
}

export const Route = createFileRoute("/institutions/")({
  component: InstitutionsIndex,
});
