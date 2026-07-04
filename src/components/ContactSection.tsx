import { useState } from "react";
import { Mail, Phone, MapPin, Globe, User, Check, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Google Apps Script web-app deployment URL. Submissions are appended to the
// linked Google Sheet and forwarded by email — see scripts/contact-apps-script.gs
// for the deployed code and setup steps.
const CONTACT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwqfF_VcUqHuv6RxOH4M8xH0JMqQDNNLYEw2ZqLHkGQic6dI5-S9ncgqbfs-CTrgzo9/exec";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [showThanks, setShowThanks] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!CONTACT_WEBHOOK_URL) {
      toast.error("The contact form is not connected yet. Please email us directly at emajicdesign@gmail.com.");
      return;
    }
    setSending(true);
    try {
      // Body is sent as a plain-text string (no JSON content-type header) so the
      // request stays a "simple" CORS request that Apps Script can accept.
      const res = await fetch(CONTACT_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      setShowThanks(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Something went wrong sending your message. Please try again, or email us directly at emajicdesign@gmail.com.");
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: User, label: "Contact Person", value: "Mc James Laurent Ocampo" },
    { icon: Phone, label: "Phone", value: "0949-997-1854" },
    { icon: Mail, label: "Email", value: "emajicdesign@gmail.com" },
    { icon: Globe, label: "Facebook", value: "facebook.com/eminteriordesign", href: "https://www.facebook.com/eminteriordesign" },
    { icon: MapPin, label: "Location", value: "Sitio Pinamuntasan, Brgy. Aga, Nasugbu, Batangas" },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-6">
          <p className="text-sm tracking-[0.4em] uppercase text-primary mb-4">Get In Touch</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">
            Connect <span className="text-gold-gradient">With Us!</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16 italic">
            We look forward to working with you!
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          <ScrollReveal direction="left">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} className="bg-card border-border focus:border-primary h-12" />
              <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} className="bg-card border-border focus:border-primary h-12" />
              <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} className="bg-card border-border focus:border-primary h-12" />
              <Textarea placeholder="Tell us about your project..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required maxLength={1000} className="bg-card border-border focus:border-primary min-h-[140px]" />
              <Button type="submit" disabled={sending} className="w-full h-12 text-sm tracking-widest uppercase font-semibold">
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-6 flex flex-col justify-center">
              <motion.div
                className="p-6 rounded-lg bg-card border border-border"
                whileHover={{ borderColor: "hsl(43 72% 52% / 0.3)" }}
              >
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Why Choose Us?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  At Ethereal Majic, we are a legally registered business with a valid DTI certificate and business permit—providing our clients with transparency and peace of mind. Backed by a team of licensed architects and engineers, who bring expertise, creativity, and precision to every project.
                </p>
              </motion.div>

              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <info.icon className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Thank you dialog */}
      <Dialog open={showThanks} onOpenChange={setShowThanks}>
        <DialogContent className="sm:max-w-md bg-card border-primary/30 overflow-hidden">
          <AnimatePresence>
            {showThanks && (
              <motion.div
                className="relative flex flex-col items-center text-center py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Animated gold burst */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.6, 0], scale: [0.5, 2, 2.5] }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  style={{
                    background: "radial-gradient(circle, hsl(var(--gold) / 0.4), transparent 60%)",
                  }}
                />

                {/* Sparkle particles */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  return (
                    <motion.div
                      key={i}
                      className="absolute top-16 left-1/2"
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      animate={{
                        x: Math.cos(angle) * 100,
                        y: Math.sin(angle) * 100,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    >
                      <Sparkles className="text-primary" size={14} />
                    </motion.div>
                  );
                })}

                {/* Check icon ring */}
                <motion.div
                  className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  >
                    <Check className="text-primary" size={36} strokeWidth={3} />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                </motion.div>

                <motion.h3
                  className="font-serif text-3xl md:text-4xl font-semibold text-gold-gradient mb-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Thank You!
                </motion.h3>
                <motion.p
                  className="text-muted-foreground text-sm max-w-xs mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  Your message has been received. Our team will reach out to you shortly to bring your vision to life.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button onClick={() => setShowThanks(false)} className="px-8">
                    Close
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ContactSection;
