import { Home, Building2, GlassWater, Layers, Hammer, Lightbulb } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const ranges = [
  { icon: Home, title: "Residential Interiors", description: "Living rooms, bedrooms, kitchens, bathrooms, and full-home renovations" },
  { icon: Building2, title: "Commercial Spaces", description: "Offices, retail shops, showrooms, restaurants, and cafes" },
  { icon: GlassWater, title: "Glass & Aluminum Works", description: "Custom partitions, doors, windows, and storefront systems" },
  { icon: Layers, title: "Interior Fit-Outs", description: "Ceiling works, flooring, wall treatments, cabinetry, and lighting" },
  { icon: Hammer, title: "Renovation & Remodelling", description: "Upgrading existing spaces with modern and client-specific designs" },
  { icon: Lightbulb, title: "Custom Design Solutions", description: "Tailored concepts to match client lifestyle, branding, or business identity" },
];

const ProjectRangeSection = () => {
  return (
    <section className="py-24 md:py-32 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-6">
          <p className="text-sm tracking-[0.4em] uppercase text-primary mb-4">What We Cover</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">
            Project <span className="text-gold-gradient">Range</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-16">
            Ethereal Majic Interior Design offers a comprehensive range of services tailored to meet the diverse needs of our clients. Our project experience spans both residential and commercial spaces, with a focus on creative, functional, and high-quality interior transformations.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {ranges.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.1} scale>
              <motion.div
                className="group text-center p-6 rounded-xl bg-card border border-border transition-all duration-500"
                whileHover={{
                  y: -6,
                  borderColor: "hsl(43 72% 52% / 0.3)",
                  boxShadow: "0 20px 60px -15px hsl(43 72% 52% / 0.1)",
                }}
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <r.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mb-2">{r.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{r.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectRangeSection;
