import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { useForgotPassword, useResetPassword } from "@/api/hooks/shop";
import AuthLayout from "./auth-layout";

// -- Step 1: Email form schema --
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
});

// -- Step 2: Reset form schema --
const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, { message: "Please enter your new password" })
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: forgotPassword, isPending: isSendingOtp } = useForgotPassword();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // -- Step 1: Email form --
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    forgotPassword(data.email, {
      onSuccess: () => {
        setEmail(data.email);
        setCooldown(RESEND_COOLDOWN);
        setStep(2);
        toast.success("OTP sent to your email");
      },
      onError: () => {
        toast.error("Failed to send OTP. Please check your email and try again.");
      },
    });
  }

  // -- Step 2: OTP + new password form --
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  function handleOtpChange(index: number, value: string) {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextEmpty = newOtp.findIndex((d) => d === "");
    inputRefs.current[nextEmpty >= 0 ? nextEmpty : OTP_LENGTH - 1]?.focus();
  }

  function onResetSubmit(data: z.infer<typeof resetSchema>) {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    resetPassword(
      { email, otp: code, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setStep(3);
          toast.success("Password reset successfully");
        },
        onError: () => {
          toast.error("Failed to reset password. Please check your OTP and try again.");
        },
      }
    );
  }

  function handleResend() {
    forgotPassword(email, {
      onSuccess: () => {
        setCooldown(RESEND_COOLDOWN);
        setOtp(Array(OTP_LENGTH).fill(""));
        toast.success("A new OTP has been sent to your email");
      },
      onError: () => {
        toast.error("Failed to resend OTP. Please try again.");
      },
    });
  }

  // -- Step 1: Enter email --
  if (step === 1) {
    return (
      <AuthLayout>
        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a verification code
              to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="grid gap-3"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-2" disabled={isSendingOtp}>
                  {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <Link
              to="/customer/sign-in"
              className="text-muted-foreground hover:text-primary text-sm underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </AuthLayout>
    );
  }

  // -- Step 2: Enter OTP + new password --
  if (step === 2) {
    return (
      <AuthLayout>
        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-foreground">{email}</span>{" "}
              and set your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(onResetSubmit)}
                className="grid gap-4"
              >
                {/* OTP Input */}
                <div>
                  <label className="text-sm font-medium leading-none">
                    Verification Code
                  </label>
                  <div className="mt-2 flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <Input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className="h-12 w-12 text-center text-lg font-semibold"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={cooldown > 0 || isSendingOtp}
                      onClick={handleResend}
                    >
                      {cooldown > 0
                        ? `Resend OTP in ${cooldown}s`
                        : isSendingOtp
                          ? "Sending..."
                          : "Resend OTP"}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <FormField
                  control={resetForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="mt-2"
                  disabled={isResetting || otp.some((d) => !d)}
                >
                  {isResetting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <Link
              to="/customer/sign-in"
              className="text-muted-foreground hover:text-primary text-sm underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </AuthLayout>
    );
  }

  // -- Step 3: Success --
  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">
            Password Reset Successful
          </CardTitle>
          <CardDescription>
            Your password has been reset successfully. You can now sign in with
            your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/customer/sign-in">
            <Button className="w-full">Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
