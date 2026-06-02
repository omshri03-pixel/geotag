"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQProps {
  activeFaq: number | null;
  setActiveFaq: (idx: number | null) => void;
}

export const FAQ = ({ activeFaq, setActiveFaq }: FAQProps) => {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-[#4D4D4D] bg-[#171717] rounded-[40px] w-full mb-16 shadow-2xl shadow-violet-500/5">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <span className="text-[#DEDEDE] font-mono text-xs uppercase tracking-widest font-black bg-[#4D4D4D] border border-[#4D4D4D] px-3.5 py-1.5 rounded-full inline-block">
          Frequently Asked Questions
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#DEDEDE] leading-tight font-sans">
          Commonly Asked Questions
        </h2>
        <p className="text-[#DEDEDE] text-sm sm:text-base max-w-xl mx-auto font-medium px-2">
          Find answers to frequently asked geocoding metadata, compiler execution, and deployment safety questions.
        </p>
      </div>

      {/* Accordions Stack */}
      <div className="max-w-3xl mx-auto space-y-4 text-left w-full">
        {[
          {
            q: "Is this compliant with map listing guidelines?",
            a: "Yes. By utilizing raw EXIF headers and natural Anti-Footprint coordinate dispersal, all tagged assets simulate organic uploads without algorithmic footprint warnings."
          },
          {
            q: "Can I batch import photos from an existing website?",
            a: "Absolutely. Enter any clinic or storefront domain in our Workspace scraper, and our backend will crawl and prepare assets bulk in seconds."
          },
          {
            q: "What image formats are supported?",
            a: "We support all camera-standard JPEGs, PNGs, and output them in next-generation WebP or AVIF formats for maximum speed."
          },
          {
            q: "Do you offer priority geocoding API access?",
            a: "Yes. Our Agency Bundle features raw coordinate compiler REST endpoints to integrate with your custom CRM."
          }
        ].map((item, idx) => {
          const isOpen = activeFaq === idx;
          return (
            <div 
              key={idx}
              className="border border-[#4D4D4D]/30 bg-[#171717]/50 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(isOpen ? null : idx)}
                className="w-full px-6 py-4.5 flex justify-between items-center text-left hover:bg-[#171717] transition-colors focus:outline-none"
              >
                <span className="font-extrabold text-xs sm:text-sm text-[#DEDEDE] tracking-wide">{item.q}</span>
                <span className="text-[#F25623] font-mono font-black text-sm shrink-0 ml-4">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 pt-1 border-t border-[#4D4D4D]/10 text-xs sm:text-sm text-[#DEDEDE]/80 leading-relaxed font-medium">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
