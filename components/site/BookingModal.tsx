"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/lib/content/catalog";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultServiceId?: string | null;
};

export function BookingModal({ isOpen, onClose, defaultServiceId }: BookingModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    dob: "",
    tobHour: "12",
    tobMin: "00",
    tobSec: "00",
    pob: "",
    serviceId: defaultServiceId || services[0].id,
    notes: "",
  });

  React.useEffect(() => {
    if (defaultServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: defaultServiceId }));
    }
  }, [defaultServiceId]);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const selectedService = services.find((s) => s.id === formData.serviceId) || services[0];
  const basePrice = selectedService.price;
  const platformFee = 99;
  const gst = Math.round((basePrice + platformFee) * 0.18);
  const total = basePrice + platformFee + gst;

  const handleBook = () => {
    const text = `Hari Om! I would like to book a consultation.
*Details:*
Name: ${formData.name}
DOB: ${formData.dob}
Time: ${formData.tobHour}:${formData.tobMin}:${formData.tobSec}
Place: ${formData.pob}
Service: ${selectedService.title}
Notes: ${formData.notes}

Please confirm my booking.`;
    
    const whatsappUrl = `https://wa.me/918697332855?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  const inputCls = "w-full rounded-xl border border-[#4A0A0A]/20 bg-white px-3 py-2.5 text-sm text-[#4A0A0A] outline-none transition-colors focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 placeholder:text-[#4A0A0A]/30";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4A0A0A]/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#FFF7E6] shadow-2xl ring-1 ring-[#4A0A0A]/10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#4A0A0A]/10 bg-white/50 px-6 py-5 backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-bold text-[#4A0A0A]" style={{ fontFamily: "var(--font-display)" }}>
                  Consultation Booking
                </h2>
                <p className="mt-1 text-sm text-[#4A0A0A]/60">Complete your details to request a session.</p>
              </div>
              <button 
                onClick={onClose} 
                className="rounded-full bg-[#4A0A0A]/5 p-2 text-[#4A0A0A]/60 transition-colors hover:bg-[#4A0A0A]/10 hover:text-[#4A0A0A]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Form Elements */}
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#4A0A0A]">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={inputCls}
                      placeholder="e.g. Arjun Sharma"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#4A0A0A]">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#4A0A0A]">Time of Birth</label>
                    <div className="flex gap-2">
                      <select value={formData.tobHour} onChange={(e) => setFormData({...formData, tobHour: e.target.value})} className={inputCls}>
                        {Array.from({length: 24}).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                      </select>
                      <span className="self-center text-[#4A0A0A]/50">:</span>
                      <select value={formData.tobMin} onChange={(e) => setFormData({...formData, tobMin: e.target.value})} className={inputCls}>
                        {Array.from({length: 60}).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                      </select>
                      <span className="self-center text-[#4A0A0A]/50">:</span>
                      <select value={formData.tobSec} onChange={(e) => setFormData({...formData, tobSec: e.target.value})} className={inputCls}>
                        {Array.from({length: 60}).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#4A0A0A]">Place of Birth</label>
                    <input
                      type="text"
                      value={formData.pob}
                      onChange={(e) => setFormData({...formData, pob: e.target.value})}
                      className={inputCls}
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>

                {/* Service Selection & Pricing */}
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#4A0A0A]">Select Service</label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                      className={inputCls}
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#4A0A0A]">Additional Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className={`${inputCls} h-24 resize-none`}
                      placeholder="Any specific questions or concerns?"
                    />
                  </div>

                  {/* Price Breakdown */}
                  <div className="rounded-2xl bg-white p-5 ring-1 ring-[#4A0A0A]/10">
                    <div className="mb-2 flex justify-between text-sm text-[#4A0A0A]/70">
                      <span>Base Price</span>
                      <span className="font-medium text-[#4A0A0A]">₹{basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mb-2 flex justify-between text-sm text-[#4A0A0A]/70">
                      <span>Platform Fee</span>
                      <span className="font-medium text-[#4A0A0A]">₹{platformFee}</span>
                    </div>
                    <div className="mb-3 flex justify-between border-b border-[#4A0A0A]/10 pb-3 text-sm text-[#4A0A0A]/70">
                      <span>GST (18%)</span>
                      <span className="font-medium text-[#4A0A0A]">₹{gst}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-[#D4AF37]">
                      <span>Total Amount</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-end gap-1.5 text-xs font-semibold tracking-wide text-green-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      50% SPECIAL DISCOUNT APPLIED
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#4A0A0A]/10 bg-white/50 px-6 py-5 backdrop-blur-md sm:flex sm:flex-row-reverse sm:gap-3">
              <button 
                onClick={handleBook} 
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4A0A0A] px-6 py-3 text-sm font-semibold text-[#FFF7E6] shadow-md transition-all hover:bg-[#3A0808] hover:shadow-lg sm:w-auto"
              >
                Proceed to WhatsApp
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
              <button 
                onClick={onClose} 
                className="mt-3 inline-flex w-full justify-center rounded-full bg-transparent px-6 py-3 text-sm font-semibold text-[#4A0A0A] ring-1 ring-[#4A0A0A]/20 transition-all hover:bg-[#4A0A0A]/5 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
