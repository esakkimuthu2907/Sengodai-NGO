import { Droplet } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <Droplet className="h-8 w-8 fill-primary text-primary" />
    </div>
    <div className="leading-tight">
      <div className="font-extrabold text-primary text-lg tracking-tight">SENGODAI</div>
      <div className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">BLOOD CONNECT</div>
    </div>
  </Link>
);
