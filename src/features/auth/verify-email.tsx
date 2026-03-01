import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useVerifyEmail, useResendOtp } from "@/api/hooks/shop";
import AuthLayout from "./auth-layout";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyEmail() {
  const search = useSearch({ strict: false }) as { email?: string };
  const email = search?.email || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function handleChange(index: number, value: string) {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (value && newOtp.every((d) => d !== "")) {
      verifyEmail({ email, otp: newOtp.join("") });
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextEmpty = newOtp.findIndex((d) => d === "");
    inputRefs.current[nextEmpty >= 0 ? nextEmpty : OTP_LENGTH - 1]?.focus();

    // Auto-submit if fully pasted
    if (newOtp.every((d) => d !== "")) {
      verifyEmail({ email, otp: newOtp.join("") });
    }
  }

  function handleResend() {
    resendOtp(email);
    setCooldown(RESEND_COOLDOWN);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === OTP_LENGTH) {
      verifyEmail({ email, otp: code });
    }
  }

  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">
            Verify your email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <Input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="h-12 w-12 text-center text-lg font-semibold"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <Button type="submit" disabled={isVerifying || otp.some((d) => !d)}>
              {isVerifying ? "Verifying..." : "Verify Email"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={cooldown > 0 || isResending}
                onClick={handleResend}
              >
                {cooldown > 0
                  ? `Resend OTP in ${cooldown}s`
                  : isResending
                    ? "Sending..."
                    : "Resend OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link
            to="/customer/sign-up"
            className="text-muted-foreground hover:text-primary text-sm underline underline-offset-4"
          >
            Back to sign up
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
