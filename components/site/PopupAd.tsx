"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

export function PopupAd() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-brand-dark/10"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-cream text-brand-dark hover:bg-brand-gold hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              Limited Time Offer
            </div>
            <h3 className="mb-2 font-display text-2xl font-bold text-brand-dark">
              Master Vedic Astrology Today!
            </h3>
            <p className="mb-6 text-brand-dark/70">
              Enroll in our premium masterclass now and get a complimentary 1-on-1 consultation with Guruji. Valid for the next 24 hours only.
            </p>
            <div className="flex gap-3">
              <Button href="/services" className="w-full">
                Claim Offer
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
