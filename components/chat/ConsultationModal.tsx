"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

export type ConsultationDetails = {
  name: string;
  dob: string;
  tob: string;
  pob: string;
};

type ConsultationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ConsultationDetails) => void;
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0
  })
};

const inputCls =
  "w-full rounded-xl border border-brand-dark/20 bg-white px-3 py-3 text-sm text-brand-dark outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 placeholder:text-brand-dark/30";

const STEP_AREA_MIN_HEIGHT = 300;

export function ConsultationModal({
  isOpen,
  onClose,
  onSubmit
}: ConsultationModalProps) {
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState(1);
  const [name, setName] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [tob, setTob] = React.useState("");
  const [pob, setPob] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDirection(1);
      setName("");
      setDob("");
      setTob("");
      setPob("");
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timeout);
  }, [isOpen, step]);

  const goNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !dob) return;
    setDirection(1);
    setStep((current) => current + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((current) => current - 1);
  };

  const handleSubmit = () => {
    if (!tob || !pob.trim()) return;
    onSubmit({ name: name.trim(), dob, tob, pob: pob.trim() });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    if (step < 3) {
      goNext();
      return;
    }

    handleSubmit();
  };

  const progressPercent = ((step - 1) / 2) * 100;

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Generate free kundali"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-brand-cream shadow-2xl ring-1 ring-brand-dark/10"
          >
            <div className="h-1 w-full bg-brand-dark/10">
              <motion.div
                className="h-full bg-brand-gold"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </div>

            <div className="flex items-center justify-between border-b border-brand-dark/10 bg-white/50 px-6 py-4 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-bold text-brand-dark font-display">Generate Free Kundali</h2>
                <p className="text-xs text-brand-dark/50">Step {step} of 3</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-brand-dark/5 p-2 text-brand-dark/60 transition hover:bg-brand-dark/10 hover:text-brand-dark"
                aria-label="Close modal"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex justify-center gap-2 pt-4">
              {[1, 2, 3].map((value) => (
                <motion.div
                  key={value}
                  animate={{ scale: value === step ? 1.2 : 1 }}
                  className={`h-2 w-2 rounded-full ${value <= step ? "bg-brand-gold" : "bg-brand-dark/15"}`}
                />
              ))}
            </div>

            <div className="relative overflow-hidden px-6 pb-6 pt-4" style={{ minHeight: STEP_AREA_MIN_HEIGHT }}>
              <AnimatePresence custom={direction} mode="wait">
                {step === 1 ? (
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
                      <label className="text-sm font-semibold text-brand-dark">Your Full Name</label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
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
                ) : null}

                {step === 2 ? (
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
                      <label className="text-sm font-semibold text-brand-dark">Date of Birth</label>
                      <input
                        ref={inputRef}
                        type="date"
                        value={dob}
                        onChange={(event) => setDob(event.target.value)}
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
                ) : null}

                {step === 3 ? (
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
                      <label className="text-sm font-semibold text-brand-dark">Time of Birth</label>
                      <input
                        ref={inputRef}
                        type="time"
                        value={tob}
                        onChange={(event) => setTob(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-brand-dark">Place of Birth</label>
                      <input
                        type="text"
                        value={pob}
                        onChange={(event) => setPob(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className={inputCls}
                        placeholder="e.g. Kolkata, India"
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
                        onClick={handleSubmit}
                        disabled={!tob || !pob.trim()}
                        className="flex-1 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-dark shadow-md transition hover:bg-brand-accent disabled:opacity-40"
                      >
                        Generate Chart →
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
