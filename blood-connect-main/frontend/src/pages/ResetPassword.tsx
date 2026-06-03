import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { authStore } from "@/store/auth";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (!token) {
      toast({ title: "Invalid reset link", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    const result = await authStore.resetPassword(token, password);
    setLoading(false);
    
    if (!result.success) {
      toast({ title: "Reset Failed", description: result.error, variant: "destructive" });
      return;
    }
    
    toast({ title: "Password Reset Successful", description: "You are now logged in." });
    
    const user = authStore.getCurrentUser();
    if (user?.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/volunteer-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(254,226,226,0.9),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(254,144,144,0.15),transparent_35%)]">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo /></div>
        <Card className="p-6 border-0 shadow-card w-full bg-white/95">
          <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your new password must be different from previous used passwords.
          </p>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label className="mb-2 block">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
