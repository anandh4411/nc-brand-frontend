import React, { useMemo } from "react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/layout/dashboard-layout";
import {
  shopNavItems,
  shopFooterItems,
  brandingConfig,
} from "@/config/navigation";
import { useLogout } from "@/api";
import { useAuth } from "@/context/auth-context";
import { UserProfile } from "@/components/layout/types";

export const ShopLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mutate: logout } = useLogout();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.navigate({ to: path as any });
  };

  const handleLogout = () => {
    logout();
  };

  const isPathActive = (path: string) => {
    if (path === "/shop") {
      return location.pathname === "/shop";
    }
    return location.pathname.startsWith(path);
  };

  const branding = {
    logo: <brandingConfig.iconComponent />,
    name: brandingConfig.name,
  };

  // Convert auth user data to UserProfile format
  const userProfile = useMemo<UserProfile | undefined>(() => {
    if (!user || !isAuthenticated) return undefined;

    return {
      name: user.name,
      email: user.email,
      avatarUrl: undefined,
    };
  }, [user, isAuthenticated]);

  return (
    <DashboardLayoutComponent
      currentPath={location.pathname}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      navigationItems={shopNavItems}
      footerItems={shopFooterItems}
      branding={branding}
      isPathActive={isPathActive}
      userProfile={userProfile}
      subText="Shop Quality Textiles"
    >
      {children}
    </DashboardLayoutComponent>
  );
};
