import React, { useMemo } from "react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/layout/dashboard-layout";
import {
  adminNavItems,
  adminFooterItems,
  brandingConfig,
} from "@/config/navigation";
import { useLogout } from "@/api";
import { useAuth } from "@/context/auth-context";
import { UserProfile } from "@/components/layout/types";

export const AdminLayout = ({
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
    if (path === "/admin") {
      return location.pathname === "/admin";
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

  return (
    <DashboardLayoutComponent
      currentPath={location.pathname}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      navigationItems={adminNavItems}
      footerItems={adminFooterItems}
      branding={branding}
      isPathActive={isPathActive}
      userProfile={userProfile}
      subText="Manufacturing Unit Dashboard"
    >
      {children}
    </DashboardLayoutComponent>
  );
};
