import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { authStore } from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Forgot = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [simulatedToken, setSimulatedToken] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    
    const result = await authStore.forgotPassword(email);
    setLoading(false);
    
    if (!result.success) {
      toast({ title: "Failed to request reset", description: result.error, variant: "destructive" });
      return;
    }
    
    setSuccess(true);
    if (result.data) {
      // In development mode, the API returns the token directly for testing
      setSimulatedToken(result.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(254,226,226,0.9),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(254,144,144,0.15),transparent_35%)]">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo /></div>
        <Card className="p-6 border-0 shadow-card w-full bg-white/95">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We have sent a password reset link to <br />
                <strong>{email}</strong>
              </p>
              
              {simulatedToken && (
                <div className="mt-4 p-4 bg-secondary rounded-lg text-left">
                  <p className="text-xs font-semibold text-primary mb-2">Development Mode Notice:</p>
                  <p className="text-xs text-muted-foreground mb-3">Since email delivery might not be configured, use this link to test:</p>
                  <Link to={`/reset-password/${simulatedToken}`}>
                    <Button variant="outline" className="w-full text-xs">Simulate Email Link Click</Button>
                  </Link>
                </div>
              )}

              <div className="pt-4">
                <Link to="/login">
                  <Button variant="ghost" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <Label className="mb-2 block">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={t("login.enter_email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center pt-2">
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Forgot;
