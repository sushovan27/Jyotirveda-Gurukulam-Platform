"use client";

import { useEffect } from "react";

export function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error", err);
    }
  }, []);

  return (
    <div className="my-6 w-full max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl overflow-hidden relative border border-[#4A0A0A]/10 p-2 min-h-[100px] flex items-center justify-center">
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 pointer-events-none">
        <span className="text-xs uppercase tracking-widest font-semibold text-gray-500">Advertisement Space</span>
        <span className="text-[10px] text-gray-400 mt-1">Google AdSense will display here on the live domain.</span>
      </div>
      
      <ins
        className="adsbygoogle w-full relative z-10"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client="ca-pub-2213817145109266"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
