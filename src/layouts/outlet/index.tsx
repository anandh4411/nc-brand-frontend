import React, { useMemo } from "react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/layout/dashboard-layout";
import {
  outletNavItems,
  outletFooterItems,
  brandingConfig,
} from "@/config/navigation";
import { useLogout } from "@/api";
import { useAuth } from "@/context/auth-context";
import { UserProfile } from "@/components/layout/types";

export const OutletLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mutate: logout } = useLogout();
  const { user } = useAuth();
  const location = useLocation();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.navigate({ to: path });
  };

  const handleLogout = () => {
    logout();
  };

  const isPathActive = (path: string) => {
    if (path === "/outlet") {
      return location.pathname === "/outlet";
    }
    return location.pathname.startsWith(path);
  };

  const branding = {
    logo: <brandingConfig.iconComponent />,
    name: brandingConfig.name,
  };

  // Convert auth user data to UserProfile format
  const userProfile = useMemo<UserProfile | undefined>(() => {
    if (!user) return undefined;

    return {
      name: user.name,
      email: user.email,
      avatarUrl: undefined,
    };
  }, [user]);

  // Get outlet name from user data if available
  const outletName = user?.outletName || "Outlet";

  return (
    <DashboardLayoutComponent
      currentPath={location.pathname}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      navigationItems={outletNavItems}
      footerItems={outletFooterItems}
      branding={branding}
      isPathActive={isPathActive}
      userProfile={userProfile}
      subText={`${outletName} Dashboard`}
    >
      {children}
    </DashboardLayoutComponent>
  );
};
