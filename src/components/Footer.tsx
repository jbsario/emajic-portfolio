import { LogoMark } from "@/components/Logo";

const Footer = () => {
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <button onClick={() => scrollTo("#home")} className="flex items-center gap-3 text-primary" aria-label="Ethereal Majic — home">
          <LogoMark className="h-9 w-auto shrink-0" />
          <span className="font-serif text-lg tracking-[0.3em]">ETHEREAL MAJIC</span>
        </button>
        <div className="flex gap-8">
          {["About", "Services", "Projects", "Contact"].map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(`#${l.toLowerCase()}`)}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {l}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Ethereal Majic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
