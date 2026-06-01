import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <img
        src="/sengodai-logo.png"
        alt="Sengodai Blood Network Logo"
        className="h-10 w-10 rounded-full object-cover"
      />
    </div>
    <div className="leading-tight">
      <div className="font-extrabold text-primary text-lg tracking-tight">SENGODAI</div>
      <div className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">BLOOD NETWORK</div>
    </div>
  </Link>
);
