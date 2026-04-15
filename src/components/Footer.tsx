import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground text-sm">
        <span>Paste. Bundle. Share.</span>
        <div className="flex items-center gap-4">
          <Link to="/faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
