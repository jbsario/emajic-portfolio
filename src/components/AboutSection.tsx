import { Target, Eye, Heart } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const cards = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To provide high-quality and sustainable interior design solutions that meet the needs and expectations of our clients, employees, and the community. We are committed to delivering creative and functional designs at competitive prices with short lead times, ensuring efficiency, value, and lasting satisfaction in every project.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To be recognized as a leading interior design and renovation company through our exceptional performance, the dedication of our people, and our unwavering commitment to our core values.",
  },
  {
    icon: Heart,
    title: "Our Core Values",
    text: "We are driven by creativity and innovation, delivering quality craftsmanship with a strong focus on client satisfaction. Integrity, transparency, and professionalism guide our relationships and decisions. We also believe in empowering our team and contributing positively to the community.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm tracking-[0.4em] uppercase text-primary mb-4">About Us</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">
            <span className="text-gold-gradient">Ethereal Majic</span>
          </h2>
        </ScrollReveal>

        {/* Company Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <ScrollReveal direction="left">
            <div className="space-y-5">
              <p className="text-muted-foreground leading-relaxed">
                Ethereal Majic Interior Design was established in 2022 with a humble beginning rooted in aluminum and glass works.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What started as a specialized service quickly grew into something much greater, as the company discovered exciting opportunities in the world of interior design and renovation.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="space-y-5">
              <p className="text-muted-foreground leading-relaxed">
                Driven by a passion for aesthetics and functionality, Ethereal Majic expanded its expertise beyond structural elements to embrace the full spectrum of interior solutions. From residential makeovers to commercial space transformations, the company evolved to meet the growing demand for creative, high-quality interior design services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our journey reflects a natural progression—from a focused trade to a holistic approach to interiors. Along the way, we've built a reputation for craftsmanship, attention to detail, and a strong commitment to client satisfaction. Ethereal Majic Interior Design continues to grow, transforming spaces into inspiring environments that reflect our clients' vision and style.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Mission, Vision, Core Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.15} scale>
              <motion.div
                className="p-8 rounded-lg bg-card border border-border transition-all duration-500"
                whileHover={{
                  y: -8,
                  borderColor: "hsl(43 72% 52% / 0.3)",
                  boxShadow: "0 20px 60px -15px hsl(43 72% 52% / 0.15)",
                }}
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <item.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
