import anvarLogo from "@/assets/anvar-logo.webp";

const Footer = () => {
  return (
    <footer className="py-10">
      {/* Luxury divider */}
      <div className="luxury-divider mb-10" />

      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={anvarLogo} alt="Anvar AI" className="h-[52px]" />
        </div>
        <p className="text-[11px] text-muted-foreground/30 font-mono tracking-[0.15em]">
          © {new Date().getFullYear()} Anvar AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;