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
import { outletApi } from "@/api/endpoints/outlet";

const outletLoginSchema = z.object({
  loginCode: z.string().length(6, "Login code must be exactly 6 characters").regex(/^[A-Za-z0-9]{6}$/, "Login code must be 6 alphanumeric characters"),
});

type OutletLoginForm = z.infer<typeof outletLoginSchema>;

function OutletLoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OutletLoginForm>({
    resolver: zodResolver(outletLoginSchema),
    defaultValues: {
      loginCode: "",
    },
  });

  const onSubmit = async (data: OutletLoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await outletApi.login(data.loginCode);
      const { outlet, accessToken, refreshToken } = response.data;

      login(
        { accessToken, refreshToken },
        {
          id: outlet.id,
          uuid: outlet.uuid,
          name: outlet.name,
          email: "",
          role: "outlet",
          outletId: outlet.id,
          outletName: outlet.name,
          outletCode: outlet.code,
        }
      );
    } catch {
      setError("Invalid login code. Please try again.");
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
              Enter your 6-digit login code to access your outlet dashboard
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
                <Label htmlFor="loginCode">Login Code</Label>
                <Input
                  id="loginCode"
                  type="password"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
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

export const Route = createFileRoute("/outlet/sign-in/")({
  component: OutletLoginPage,
});
