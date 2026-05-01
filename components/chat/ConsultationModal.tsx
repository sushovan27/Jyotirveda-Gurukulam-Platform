"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConsultationDetails = {
  name: string;
  dob: string;
  tob: string;
};

type ConsultationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ConsultationDetails) => void;
};

// ---------------------------------------------------------------------------
// Step slide variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const inputCls =
  "w-full rounded-xl border border-brand-dark/20 bg-white px-3 py-3 text-sm text-brand-dark outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 placeholder:text-brand-dark/30";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConsultationModal({
  isOpen,
  onClose,
  onSubmit,
}: ConsultationModalProps) {
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState(1);
  const [name, setName] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [tob, setTob] = React.useState("");

  // Ref for focusing the first input in each step
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Reset when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDirection(1);
      setName("");
      setDob("");
      setTob("");
    }
  }, [isOpen]);

  // Auto-focus input when step changes
  React.useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [step, isOpen]);

  const goNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !dob) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!tob) return;
    onSubmit({ name: name.trim(), dob, tob });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step < 3) goNext();
      else handleSubmit();
    }
  };

  const progressPercent = ((step - 1) / 2) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Book Consultation"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-brand-cream shadow-2xl ring-1 ring-brand-dark/10"
          >
            {/* Progress bar */}
            <div className="h-1 w-full bg-brand-dark/10">
              <motion.div
                className="h-full bg-brand-gold"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-dark/10 bg-white/50 px-6 py-4 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-bold text-brand-dark font-display">
                  Book Consultation
                </h2>
                <p className="text-xs text-brand-dark/50">
                  Step {step} of 3
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-brand-dark/5 p-2 text-brand-dark/60 transition hover:bg-brand-dark/10 hover:text-brand-dark"
                aria-label="Close modal"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Step dots */}
            <div className="flex justify-center gap-2 pt-4">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  animate={{
                    scale: s === step ? 1.2 : 1,
                    backgroundColor:
                      s <= step ? "#D4AF37" : "rgba(74,10,10,0.15)",
                  }}
                  className="h-2 w-2 rounded-full"
                />
              ))}
            </div>

            {/* Step content */}
            <div className="relative overflow-hidden px-6 pb-6 pt-4" style={{ minHeight: 220 }}>
              <AnimatePresence custom={direction} mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-brand-dark">
                        Your Full Name
                      </label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Priya Sharma"
                        maxLength={100}
                        className={inputCls}
                        autoComplete="name"
                      />
                    </div>
                    <button
                      onClick={goNext}
                      disabled={!name.trim()}
                      className="mt-2 w-full rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-brand-cream shadow-md transition hover:bg-[#3A0808] disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-brand-dark">
                        Date of Birth
                      </label>
                      <input
                        ref={inputRef}
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={inputCls}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={goBack}
                        className="flex-1 rounded-full px-5 py-3 text-sm font-semibold text-brand-dark ring-1 ring-brand-dark/20 transition hover:bg-brand-dark/5"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={goNext}
                        disabled={!dob}
                        className="flex-1 rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-brand-cream shadow-md transition hover:bg-[#3A0808] disabled:opacity-40"
                      >
                        Next →
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-brand-dark">
                        Time of Birth
                      </label>
                      <input
                        ref={inputRef}
                        type="time"
                        value={tob}
                        onChange={(e) => setTob(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={inputCls}
                      />
                      <p className="text-xs text-brand-dark/50">
                        Don&apos;t know the exact time? Enter an approximate.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={goBack}
                        className="flex-1 rounded-full px-5 py-3 text-sm font-semibold text-brand-dark ring-1 ring-brand-dark/20 transition hover:bg-brand-dark/5"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!tob}
                        className="flex-1 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-dark shadow-md transition hover:bg-brand-accent disabled:opacity-40"
                      >
                        Submit →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
