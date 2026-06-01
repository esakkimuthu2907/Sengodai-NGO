import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-blood.png";

const Login = () => {
  const [show, setShow] = useState(false);
  const [method, setMethod] = useState<"mobile" | "email">("mobile");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center gradient-soft p-12">
        <Logo />
        <div className="mt-8 text-center">
          <h2 className="text-4xl font-extrabold">Welcome Back!</h2>
          <p className="text-muted-foreground mt-2">Login to continue your account</p>
        </div>
        <img src={hero} alt="" width={500} height={500} className="max-w-md mt-6 animate-float" />
      </div>
      <div className="flex flex-col justify-center p-6 lg:p-16">
        <div className="lg:hidden mb-8"><Logo /></div>
        <Card className="p-8 border-0 shadow-card max-w-md w-full mx-auto">
          <h1 className="text-2xl font-bold">Login</h1>
          <Tabs defaultValue="donor" className="mt-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="donor">Donor / Volunteer</TabsTrigger>
              <TabsTrigger value="receiver">Receiver</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-6 space-y-4">
            <div>
              <Label className="mb-2 block">Login with</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={method === "mobile"} onChange={() => setMethod("mobile")} className="accent-primary" />
                  Mobile Number
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={method === "email"} onChange={() => setMethod("email")} className="accent-primary" />
                  Email
                </label>
              </div>
            </div>
            <div className="relative">
              {method === "mobile" ? <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
              <Input placeholder={method === "mobile" ? "Enter mobile number" : "Enter email"} className="pl-9" />
            </div>
            <div className="relative">
              <Input type={show ? "text" : "password"} placeholder="Enter password" />
              <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-right">
              <Link to="#" className="text-sm text-primary font-semibold">Forgot Password?</Link>
            </div>
            <Button className="w-full" size="lg" onClick={() => navigate("/dashboard")}>Login</Button>
            <div className="text-center text-sm text-muted-foreground">or continue with</div>
            <div className="flex justify-center gap-3">
              {["G","f",""].map((c, i) => (
                <button key={i} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary font-bold">
                  {c || "🍎"}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/signup" className="text-primary font-semibold">Sign Up</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
