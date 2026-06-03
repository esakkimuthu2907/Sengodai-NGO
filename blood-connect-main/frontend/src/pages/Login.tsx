import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, ShieldCheck, UserCheck } from "lucide-react";
import { useState } from "react";
import { authStore } from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [loginAs, setLoginAs] = useState<"volunteer" | "admin">("volunteer");
  const [method, setMethod] = useState<"mobile" | "email">("mobile");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    
    const payload = method === 'mobile'
      ? { phone: identifier, password }
      : { email: identifier, password };

    const result = await authStore.login(payload);
    setLoading(false);
    
    if (!result.success) {
      toast({ title: "Login Failed", description: result.error, variant: "destructive" });
      return;
    }
    const user = authStore.getCurrentUser();
    toast({ title: "Welcome back!", description: `Logged in as ${user?.name || user?.firstName}` });
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
          <h1 className="text-2xl font-bold">{t("login.login_as")}</h1>

          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={() => setLoginAs("volunteer")}
              className={`flex items-center gap-2 justify-center py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                loginAs === "volunteer"
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              {t("login.volunteer")}
            </button>
            <button
              onClick={() => setLoginAs("admin")}
              className={`flex items-center gap-2 justify-center py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                loginAs === "admin"
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              {t("login.admin")}
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Login method toggle */}
            <div>
              <Label className="mb-2 block">{t("login.login_with")}</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={method === "mobile"} onChange={() => setMethod("mobile")} className="accent-primary" />
                  {t("login.mobile_no")}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={method === "email"} onChange={() => setMethod("email")} className="accent-primary" />
                  {t("login.email_pass")}
                </label>
              </div>
            </div>

            {/* Identifier field */}
            <div className="relative">
              {method === "mobile" ? (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              ) : (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                placeholder={method === "mobile" ? t("login.enter_mobile") : t("login.enter_email")}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder={t("login.enter_pass")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/forgot-password" className="text-sm text-primary font-semibold">{t("login.forgot_pass")}</Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? t("login.logging_in") : t("login.login_btn")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("login.no_account")} {" "}
              <Link to="/signup" className="text-primary font-semibold">{t("login.signup")}</Link>
            </p>

            {loginAs === "volunteer" && (
              <div className="p-3 rounded-lg bg-secondary/60 text-xs text-muted-foreground text-center">
                <strong>{t("login.demo_volunteer")}</strong> esakkimuthu2907@gmail.com / Esakki123
              </div>
            )}

            {loginAs === "admin" && (
              <div className="p-3 rounded-lg bg-secondary/60 text-xs text-muted-foreground text-center">
                <strong>{t("login.demo_admin")}</strong> admin@sengodai.org / admin123
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
