import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import hero from "@/assets/hero-blood.png";

const steps = ["Basic Info", "Contact Info", "Location", "Availability"];

const Signup = () => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState("Male");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center gradient-soft p-12">
        <Logo />
        <img src={hero} alt="" width={500} height={500} className="max-w-md mt-8 animate-float" />
      </div>
      <div className="flex flex-col justify-center p-6 lg:p-16">
        <Card className="p-8 border-0 shadow-card max-w-lg w-full mx-auto">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join us and save lives</p>
          <div className="flex items-center justify-between my-6">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{i + 1}</div>
                <span className="text-[10px] mt-1 text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="Enter your full name" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Blood Group</Label>
                <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select blood group" /></SelectTrigger>
                  <SelectContent>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Gender</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["Male","Female","Other"].map((g) => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`py-2.5 rounded-lg border text-sm font-medium ${gender === g ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={() => step < 4 ? setStep(step + 1) : navigate("/dashboard")}>
              {step < 4 ? "Next" : "Finish"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
