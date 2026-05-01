"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { services } from "@/lib/content/catalog";
import { BookingModal } from "./BookingModal";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const ICONS = ["🔮", "🌟", "📖", "✨"] as const;

export function ServiceSection() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);

  const handleBookClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setModalOpen(true);
  };

  return (
    <>
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-8 grid gap-6 md:grid-cols-2"
      >
        {services.map((s, i) => (
          <motion.div 
            variants={item}
            key={s.id} 
            className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm p-8 ring-1 ring-brand-dark/8 transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.15)] hover:ring-brand-gold/25"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Icon */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream ring-1 ring-brand-gold/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-gold/10">
              <span className="text-2xl">{ICONS[i % ICONS.length]}</span>
            </div>

            <h3 className="mb-2 text-2xl font-semibold text-brand-dark font-display">
              {s.title}
            </h3>
            <div className="mb-5 text-[11px] font-medium tracking-[0.14em] text-brand-dark/50 uppercase">
              {s.duration}
            </div>

            <div className="mb-6 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-dark/35 line-through">₹{s.originalPrice.toLocaleString('en-IN')}</span>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-700 ring-1 ring-green-600/15">50% OFF</span>
              </div>
              <div className="mt-1.5 text-3xl font-bold text-brand-gold">
                ₹{s.price.toLocaleString('en-IN')}
              </div>
            </div>

            <p className="mb-8 text-sm leading-relaxed text-brand-dark/65">
              {s.description}
            </p>

            <div className="mt-auto mb-8 w-full space-y-2.5 text-left">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-dark/40">Includes</div>
              {s.includes.map((inc, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-brand-dark/75">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold/60" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleBookClick(s.id)}
              className="w-full rounded-full bg-brand-dark px-6 py-3.5 text-sm font-semibold text-brand-cream transition-all duration-200 hover:bg-[#3A0808] hover:shadow-lg active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Book Consultation
            </button>
          </motion.div>
        ))}
      </motion.div>

      <BookingModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultServiceId={selectedServiceId}
      />
    </>
  );
}
