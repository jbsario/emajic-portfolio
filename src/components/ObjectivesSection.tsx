import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const objectives = [
  "To deliver outstanding design and renovation services that reflect client goals, timelines, and budgets.",
  "To consistently offer innovative and functional interior solutions at competitive prices.",
  "To expand our presence in the interior design industry through a diverse and high-quality project portfolio.",
  "To foster a strong, skilled, and motivated team committed to excellence.",
  "To build long-term relationships with clients through reliability, creativity, and service satisfaction.",
  "To contribute positively to our community through ethical business practices and social responsibility.",
];

const ObjectivesSection = () => {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm tracking-[0.4em] uppercase text-primary mb-4">Our Goals</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">
            Company <span className="text-gold-gradient">Objectives</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our objectives guide our daily operations and long-term growth, ensuring we deliver excellence, and value in everything we do.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, i) => (
            <ScrollReveal key={i} delay={i * 0.08} scale>
              <motion.div
                className="flex items-start gap-4 p-6 rounded-lg bg-card border border-border transition-all duration-300"
                whileHover={{
                  borderColor: "hsl(43 72% 52% / 0.3)",
                  y: -4,
                }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/30">
                  <span className="font-serif text-lg font-bold text-gold-gradient">{i + 1}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{obj}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;
