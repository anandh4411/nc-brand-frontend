import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Store } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const outletLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  loginCode: z.string().min(6, "Login code must be at least 6 characters"),
});

type OutletLoginForm = z.infer<typeof outletLoginSchema>;

function OutletLoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OutletLoginForm>({
    resolver: zodResolver(outletLoginSchema),
    defaultValues: {
      email: "chennai@ncbrand.com",
      loginCode: "NCB001",
    },
  });

  const onSubmit = async (data: OutletLoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock validation - accept any credentials for testing
      // In real app, this would validate against backend

      // Mock tokens and user data for outlet
      const mockTokens = {
        accessToken: "mock_outlet_access_token_" + Date.now(),
        refreshToken: "mock_outlet_refresh_token_" + Date.now(),
      };

      const mockUserData = {
        id: 1,
        uuid: "outlet-uuid-" + data.loginCode,
        name: "NC Brand Outlet",
        email: data.email,
        role: "outlet" as const,
      };

      login(mockTokens, mockUserData);
    } catch (err) {
      setError("Failed to login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Store className="h-6 w-6" />
          <h1 className="text-xl font-medium">Outlet Login</h1>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your outlet dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="outlet@ncbrand.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginCode">Login Code</Label>
                <Input
                  id="loginCode"
                  type="password"
                  placeholder="Enter your login code"
                  {...form.register("loginCode")}
                />
                {form.formState.errors.loginCode && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.loginCode.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/outlet/login/")({
  component: OutletLoginPage,
});
