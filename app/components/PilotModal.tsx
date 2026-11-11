"use client";

import { useActionState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { submitPilotApplication, type PilotApplicationState } from "@/app/lib/actions";

const initialState: PilotApplicationState = { success: false, message: "" };
const fieldStyle = "mt-1 block min-h-11 w-full rounded-sm border border-[#9dadde] bg-white px-3 text-sm text-[#101b43] transition-colors duration-200 hover:border-[#0038ff] focus:border-[#0038ff] focus:ring-2 focus:ring-[#0038ff]/20 focus:outline-none";

interface PilotModalProps {
  isOpen: boolean;
  selectedPack: string;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
}

export function PilotModal({ isOpen, selectedPack, onClose, returnFocusTo }: PilotModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-sm bg-[#f7f8ff] p-6 text-[#101b43] sm:max-w-lg"
        onCloseAutoFocus={(event) => {
          if (returnFocusTo?.isConnected) {
            event.preventDefault();
            returnFocusTo.focus();
          }
        }}
      >
        <DialogTitle className="pr-8 text-2xl font-bold">Brand pilot</DialogTitle>
        <DialogDescription className="text-[#34436f]">
          Preview the pilot application for Philippine fashion brands. This demo checks the form and does not save your details.
        </DialogDescription>
        {isOpen && <PilotForm selectedPack={selectedPack} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function PilotForm({ selectedPack, onClose }: { selectedPack: string; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(submitPilotApplication, initialState);

  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state.success) closeButton.current?.focus();
  }, [state.success]);

  if (state.success) {
    return (
      <div className="space-y-4">
        <p role="status">Your form passed the demo checks.</p>
        <button type="button" className="editorial-action" ref={closeButton} onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {state.message && <p role="alert" className="text-[#a51d49] sm:col-span-2">{state.message}</p>}
      <label>
        Brand name
        <input className={fieldStyle} name="brandName" autoComplete="organization" required />
        {state.errors?.brandName && <span className="text-[#a51d49]">{state.errors.brandName[0]}</span>}
      </label>
      <label>
        Instagram or store link
        <input className={fieldStyle} name="storeUrl" required />
        {state.errors?.storeUrl && <span className="text-[#a51d49]">{state.errors.storeUrl[0]}</span>}
      </label>
      <label>
        Contact email
        <input className={fieldStyle} name="contactEmail" type="email" autoComplete="email" required />
        {state.errors?.contactEmail && <span className="text-[#a51d49]">{state.errors.contactEmail[0]}</span>}
      </label>
      <label>
        Average item price (₱)
        <input className={fieldStyle} name="averagePrice" type="number" min="500" step="100" defaultValue="1800" required />
        {state.errors?.averagePrice && <span className="text-[#a51d49]">{state.errors.averagePrice[0]}</span>}
      </label>
      <label>
        Main category
        <select className={fieldStyle} name="garmentCategory">
          <option value="dresses">Dresses and eveningwear</option>
          <option value="barong">Barong and heritage wear</option>
          <option value="tailored">Tops and outerwear</option>
          <option value="capsule">Capsule collections</option>
        </select>
      </label>
      <label>
        Preferred pack
        <select className={fieldStyle} name="selectedPack" defaultValue={selectedPack}>
          <option value="499">Starter · ₱499</option>
          <option value="1799">Growth · ₱1,799</option>
          <option value="larger_business">Larger business · ₱4,999/mo + metered usage</option>
          <option value="enterprise">Custom · quote after discovery</option>
        </select>
      </label>
      <button type="submit" disabled={isPending} className="editorial-action justify-center disabled:cursor-wait sm:col-span-2">
        {isPending ? "Checking…" : "Check demo application"}
      </button>
    </form>
  );
}
