import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Droplet } from "lucide-react";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 gradient-soft">
    <Logo />
    <div className="mt-12 text-center">
      <div className="relative inline-block">
        <h1 className="text-[10rem] font-extrabold text-primary leading-none">404</h1>
        <Droplet className="absolute -right-8 top-8 h-12 w-12 fill-primary text-primary animate-pulse-heart" />
      </div>
      <h2 className="text-2xl font-bold mt-4">Oops! Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/"><Button size="lg" className="mt-8 px-10">Go Back Home</Button></Link>
    </div>
  </div>
);

export default NotFound;
