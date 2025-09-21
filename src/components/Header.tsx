import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import kalashetraLogo from "@/assets/kalashetra-logo.jpeg";

const Header = () => {
  return (
    <header className="w-full bg-gradient-heritage border-b border-heritage-bronze/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={kalashetraLogo} 
            alt="KalaShetra Logo" 
            className="h-12 w-auto object-contain"
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/login" className="text-foreground hover:text-primary transition-colors font-medium">
            Shop
          </Link>
          <Link to="/features" className="text-foreground hover:text-primary transition-colors font-medium">
            Features
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Navigation only - buttons moved to homepage */}
        </div>
      </div>
    </header>
  );
};

export default Header;