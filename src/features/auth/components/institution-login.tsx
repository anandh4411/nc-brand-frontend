import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Building2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/auth-context';
import { useInstitutionLogin } from '@/api/hooks/institution';
import {
  InstitutionLoginRequestSchema,
  type InstitutionLoginRequest,
} from '@/types/dto/institution-auth.dto';

export function InstitutionLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const loginMutation = useInstitutionLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstitutionLoginRequest>({
    resolver: zodResolver(InstitutionLoginRequestSchema),
  });

  const onSubmit = async (data: InstitutionLoginRequest) => {
    try {
      const response = await loginMutation.mutateAsync(data);

      if (response && response.data) {
        const { accessToken, refreshToken, user } = response.data;
        login({ accessToken, refreshToken }, user);
      }
    } catch (error) {
      // Error handled by mutation hook
      console.error('Login error:', error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Institution Login</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="institution@example.com"
            {...register('email')}
            disabled={loginMutation.isPending}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Institution Code Field */}
        <div className="space-y-2">
          <Label htmlFor="institutionCode" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Institution Code
          </Label>
          <Input
            id="institutionCode"
            type="text"
            placeholder="SCH-2024-001"
            {...register('institutionCode')}
            disabled={loginMutation.isPending}
            className={errors.institutionCode ? 'border-destructive' : ''}
          />
          {errors.institutionCode && (
            <p className="text-sm text-destructive">{errors.institutionCode.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter the institution code provided by your administrator
          </p>
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Help Text */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Don't have access?{' '}
          <a href="#" className="text-primary hover:underline">
            Contact your administrator
          </a>
        </p>
      </div>
    </div>
  );
}
