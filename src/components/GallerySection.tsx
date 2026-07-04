import { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import glassAluminum from "@/assets/gallery-glass-aluminum.jpg";
import glassWorks from "@/assets/gallery-glass-works.jpg";
import interiorDesign from "@/assets/gallery-interior.jpg";
import renovations from "@/assets/gallery-renovations.jpg";
import charlesUnit from "@/assets/project-charles.jpg";
import cartlandUnit from "@/assets/project-cartland.jpg";
import christieUnit from "@/assets/project-christie.jpg";
import calistaEnd from "@/assets/project-calista-end.jpg";
import calistaMid from "@/assets/project-calista-mid.jpg";

type Category = "all" | "glass" | "interior" | "renovation" | "architecture" | "video";

type MediaType = "image" | "video";

interface Project {
  src: string;
  thumbnail?: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, "all">;
  type: MediaType;
}

const projects: Project[] = [
  { src: glassAluminum, title: "Glass & Aluminum Works", subtitle: "Where We Started", category: "glass", type: "image" },
  { src: glassWorks, title: "Glass & Aluminum Gallery", subtitle: "Custom Installations", category: "glass", type: "image" },
  { src: interiorDesign, title: "Interior Design Gallery", subtitle: "Creative Spaces", category: "interior", type: "image" },
  { src: renovations, title: "Minor Renovations", subtitle: "Smart Improvements", category: "renovation", type: "image" },
  { src: charlesUnit, title: "Charles Unit", subtitle: "Phirst Edition Batulao", category: "architecture", type: "image" },
  { src: cartlandUnit, title: "Cartland Unit", subtitle: "Phirst Edition Batulao", category: "architecture", type: "image" },
  { src: christieUnit, title: "Christie Unit", subtitle: "Phirst Edition Batulao", category: "architecture", type: "image" },
  { src: calistaEnd, title: "Calista End Unit", subtitle: "Phirst Park Batulao", category: "architecture", type: "image" },
  { src: calistaMid, title: "Calista Mid Unit", subtitle: "Phirst Park Batulao", category: "architecture", type: "image" },
  // Videos — uncomment and update src/thumbnail when you upload video files:
  // { src: "/videos/project-walkthrough.mp4", thumbnail: "/videos/thumb-walkthrough.jpg", title: "Project Walkthrough", subtitle: "Behind the Scenes", category: "video", type: "video" },
  // { src: "/videos/interior-timelapse.mp4", thumbnail: "/videos/thumb-timelapse.jpg", title: "Interior Timelapse", subtitle: "From Concept to Reality", category: "video", type: "video" },
];

const filters: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Glass & Aluminum", value: "glass" },
  { label: "Interior Design", value: "interior" },
  { label: "Renovation", value: "renovation" },
  { label: "Architecture", value: "architecture" },
  { label: "Videos", value: "video" },
];

const GallerySection = () => {
  const [filter, setFilter] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const closeLightbox = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setLightbox(null);
  };

  const navigate = (dir: number) => {
    if (lightbox === null) return;
    if (videoRef.current) videoRef.current.pause();
    setLightbox((lightbox + dir + filtered.length) % filtered.length);
  };

  const currentItem = lightbox !== null ? filtered[lightbox] : null;

  return (
    <section id="projects" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-6">
          <p className="text-sm tracking-[0.4em] uppercase text-primary mb-4">Portfolio</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">
            Portfolio <span className="text-gold-gradient">Highlights</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            At Ethereal Majic Interior Design, our portfolio reflects the diversity, creativity, and quality of our work. We have successfully completed a wide range of projects that showcase our attention to detail, design expertise, and commitment to client satisfaction.
          </p>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all duration-300 border ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setLightbox(i)}
                whileHover={{ y: -4 }}
              >
                {p.type === "video" ? (
                  <>
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        loading="lazy"
                        className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <video
                        src={p.src}
                        muted
                        preload="metadata"
                        className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={p.src}
                    alt={p.title}
                    loading="lazy"
                    width={800}
                    height={450}
                    className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{p.title}</h3>
                    <p className="text-xs text-primary tracking-widest uppercase">{p.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && currentItem && (
          <motion.div
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="absolute top-6 right-6 text-foreground/70 hover:text-foreground z-10" onClick={closeLightbox}>
              <X size={32} />
            </button>
            <button
              className="absolute left-4 md:left-8 text-foreground/70 hover:text-foreground z-10"
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            >
              <ChevronLeft size={40} />
            </button>

            {currentItem.type === "video" ? (
              <motion.video
                key={lightbox}
                ref={videoRef}
                src={currentItem.src}
                controls
                autoPlay
                className="max-h-[80vh] max-w-[90vw] rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img
                key={lightbox}
                src={currentItem.src}
                alt={currentItem.title}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <button
              className="absolute right-4 md:right-8 text-foreground/70 hover:text-foreground z-10"
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
            >
              <ChevronRight size={40} />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="font-serif text-lg text-foreground">{currentItem.title}</p>
              <p className="text-xs text-primary tracking-widest uppercase">{currentItem.subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
