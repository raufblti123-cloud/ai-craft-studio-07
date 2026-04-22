import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? "backdrop-blur-md bg-background/70 border-b border-border" : ""
      }`}
    >
      <nav className="container-tight flex items-center justify-between h-16">
        <Link to="/" className="font-mono text-sm flex items-center gap-2 group">
          <span className="text-primary">▮</span>
          <span className="tracking-widest">RAUF.KHAN</span>
          <span className="text-muted-foreground group-hover:text-primary transition">/_</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {pathname === "/" &&
            links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          <Link
            to="/admin"
            className="font-mono text-xs uppercase tracking-widest border border-border px-3 py-1.5 hover:border-primary hover:text-primary transition"
          >
            Admin
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container-tight py-4 flex flex-col gap-3">
            {pathname === "/" &&
              links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm uppercase tracking-widest py-2 text-muted-foreground hover:text-primary"
                >
                  {l.label}
                </a>
              ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-widest py-2 border-t border-border pt-3 text-primary"
            >
              Admin →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
