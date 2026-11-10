"use client";

import React, { useActionState } from "react";
import { X, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitPilotApplication, PilotApplicationState } from "@/app/lib/actions";

interface PilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialState: PilotApplicationState = {
  success: false,
  message: "",
};

export function PilotModal({ isOpen, onClose }: PilotModalProps) {
  const [state, formAction, isPending] = useActionState(submitPilotApplication, initialState);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0E1017] border border-white/[0.14] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#60A5FA] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0038FF] animate-pulse" />
            <span>PHILIPPINE PILOT INTAKE (3–5 BRANDS)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Apply for Controlled Brand Pilot
          </h3>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            We are approving 3–5 Philippine fashion brands selling curated apparel via DMs, appointments, or boutique checkout to test 30s mirror previews.
          </p>
        </div>

        {state.success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">Application Received</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              {state.message}
            </p>
            <div className="pt-4">
              <Button
                onClick={onClose}
                className="bg-[#0038FF] hover:bg-[#1A4CFF] text-white text-xs font-mono"
              >
                Close & Return to Sandbox
              </Button>
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state.message && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{state.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Brand Name *
                </label>
                <input
                  type="text"
                  name="brandName"
                  required
                  placeholder="e.g. Sining Atelier"
                  className="w-full px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0038FF]"
                />
                {state.errors?.brandName && (
                  <p className="text-[11px] text-red-400 mt-1">{state.errors.brandName[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Instagram / Store URL *
                </label>
                <input
                  type="text"
                  name="storeUrl"
                  required
                  placeholder="@brandname or url"
                  className="w-full px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0038FF]"
                />
                {state.errors?.storeUrl && (
                  <p className="text-[11px] text-red-400 mt-1">{state.errors.storeUrl[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Primary Category
                </label>
                <select
                  name="garmentCategory"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#141720] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#0038FF]"
                >
                  <option value="dresses">Curated Dresses & Eveningwear</option>
                  <option value="barong">Modern Barong & Heritage</option>
                  <option value="tailored">Tailored Tops & Outerwear</option>
                  <option value="capsule">Artisanal Capsule Pieces</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Avg. Item Retail Price (₱) *
                </label>
                <input
                  type="number"
                  name="averagePrice"
                  min="500"
                  step="100"
                  defaultValue="1800"
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0038FF]"
                />
                {state.errors?.averagePrice && (
                  <p className="text-[11px] text-red-400 mt-1">{state.errors.averagePrice[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  placeholder="founder@brand.ph"
                  className="w-full px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0038FF]"
                />
                {state.errors?.contactEmail && (
                  <p className="text-[11px] text-red-400 mt-1">{state.errors.contactEmail[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Pilot Pack Preference
                </label>
                <select
                  name="selectedPack"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#141720] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#0038FF]"
                >
                  <option value="499">₱499 Starter Pack (5 Previews)</option>
                  <option value="1799">₱1,799 Growing Pack (20 Previews)</option>
                  <option value="enterprise">₱4,999 Larger Business Tier</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-[#0038FF] hover:bg-[#1A4CFF] text-white text-xs font-medium font-mono uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <span>Submitting Criteria...</span>
                ) : (
                  <>
                    <span>Submit Brand for Pilot Intake</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                Philippine DPA (RA 10173) Protected
              </span>
              <span>No Automatic Recurring Charges</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
