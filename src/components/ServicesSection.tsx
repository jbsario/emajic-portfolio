import { Home, Building2, Hammer, GlassWater, Lightbulb } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const services = [
  {
    icon: Home,
    title: "Residential Interiors Design",
    items: ["Full home renovations", "Living room, bedroom, kitchen, and bathroom design", "Space planning and layout optimization", "Customized furniture and storage solutions"],
  },
  {
    icon: Building2,
    title: "Commercial & Office Interiors",
    items: ["Retail shops, offices, cafes, and restaurants", "Interior fit-outs and space branding", "Reception areas, workspaces, and conference rooms", "Lighting and ambiance enhancement"],
  },
  {
    icon: Hammer,
    title: "Renovation & Remodeling",
    items: ["Partial and full space remodeling", "Modernization of outdated spaces", "Material upgrades and finish enhancements", "Customized design based on client preferences"],
  },
  {
    icon: GlassWater,
    title: "Glass & Aluminum Works",
    items: ["Windows, sliding doors, and partition walls", "Frameless glass installations", "Storefronts and custom enclosures", "Aluminum framing and structural details"],
  },
  {
    icon: Lightbulb,
    title: "Custom Design Solutions",
    items: ["3D design concepts and visual presentations", "Color schemes, textures, and finishes coordination", "Furniture and fixture sourcing", "Project management from concept to completion"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-6">
          <p className="text-sm tracking-[0.4em] uppercase text-primary mb-4">What We Do</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">
            Our <span className="text-gold-gradient">Services</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-16">
            At Ethereal Majic Interior Design, we provide a full spectrum of interior and renovation services tailored to bring our clients' visions to life with style, function, and quality.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <ScrollReveal
              key={s.title}
              delay={i * 0.1}
              scale
              className={i === 4 ? "md:col-start-1 lg:col-start-2" : ""}
            >
              <motion.div
                className="group p-8 rounded-lg bg-card border border-border transition-all duration-500 h-full"
                whileHover={{
                  y: -8,
                  borderColor: "hsl(43 72% 52% / 0.4)",
                  boxShadow: "0 20px 60px -15px hsl(43 72% 52% / 0.15)",
                }}
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">{s.title}</h3>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="text-muted-foreground text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-primary mt-1 text-xs">●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
