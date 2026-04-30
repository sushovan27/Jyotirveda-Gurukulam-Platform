"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { services } from "@/lib/content/catalog";
import { BookingModal } from "./BookingModal";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

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
        {services.map((s) => (
          <motion.div 
            variants={item}
            key={s.id} 
            className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-[#4A0A0A]/10 transition-all hover:shadow-xl hover:shadow-[#D4AF37]/10"
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF7E6] text-[#D4AF37] ring-1 ring-[#D4AF37]/30 transition-transform duration-500 group-hover:scale-110">
              <span className="text-2xl" style={{ fontFamily: "var(--font-sanskrit)" }}>ॐ</span>
            </div>

            <h3 className="mb-2 text-2xl font-semibold text-[#4A0A0A]" style={{ fontFamily: "var(--font-display)" }}>
              {s.title}
            </h3>
            <div className="mb-5 text-sm font-medium tracking-wide text-[#4A0A0A]/60 uppercase">
              {s.duration}
            </div>

            <div className="mb-6 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#4A0A0A]/40 line-through">₹{s.originalPrice.toLocaleString('en-IN')}</span>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold tracking-wider text-green-700 ring-1 ring-green-600/20">50% OFF</span>
              </div>
              <div className="mt-1 text-3xl font-bold text-[#D4AF37]">
                ₹{s.price.toLocaleString('en-IN')}
              </div>
            </div>

            <p className="mb-8 text-sm leading-relaxed text-[#4A0A0A]/75">
              {s.description}
            </p>

            <div className="mt-auto mb-8 w-full space-y-3 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-[#4A0A0A]/50">Includes:</div>
              {s.includes.map((inc, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-[#4A0A0A]/80">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleBookClick(s.id)}
              className="w-full rounded-full bg-[#4A0A0A] px-6 py-3.5 text-sm font-semibold text-[#FFF7E6] transition-all hover:bg-[#3A0808] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
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
