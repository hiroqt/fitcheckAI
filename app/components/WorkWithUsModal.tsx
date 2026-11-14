"use client";

import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getInquiryMailto, type InquiryType } from "@/app/lib/pilotEmail";

interface WorkWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

const inquiries: { type: InquiryType; title: string; description: string }[] = [
  { type: "general", title: "General inquiry", description: "Questions about FitCheck or working together." },
  { type: "pricing", title: "Pricing & availability", description: "Pilot plans, pricing, and availability." },
  { type: "demo", title: "Request a demo", description: "See how FitCheck could work for your brand." },
];

export function WorkWithUsModal({ isOpen, onClose, selectedPlan }: WorkWithUsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto border border-[#d5d5e4] bg-white p-5 text-[#101b43] shadow-2xl sm:max-w-lg sm:p-8">
        <div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-[#101b43]">
            Work with us
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-[#515d82]">
            Choose a topic to open an email draft.
          </DialogDescription>
        </div>

        <nav aria-label="Choose an inquiry type" className="mt-4 divide-y divide-[#d5d5e4] border-y border-[#d5d5e4]">
          {inquiries.map(({ type, title, description }) => (
            <a
              key={type}
              href={getInquiryMailto(type, selectedPlan)}
              className="group flex min-h-20 items-center justify-between gap-5 py-3 text-left outline-none transition-colors hover:text-[#0038ff] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0038ff]"
            >
              <span>
                <span className="block text-base font-semibold text-[#101b43] group-hover:text-[#0038ff]">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-[#515d82]">{description}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-[#0038ff]" />
            </a>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
