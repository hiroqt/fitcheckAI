import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { Navbar } from "./Navbar";

export function Hero({ onOpenPilotModal }: { onOpenPilotModal: () => void }) {
  return (
    <section id="scene-hero" className="campaign-hero text-white">
      <Navbar onOpenPilotModal={onOpenPilotModal} />
      <div className="campaign-stage">
        <h1 className="campaign-wordmark">STYLE, IN MOTION</h1>
        <div className="campaign-garment">
          <Image
            src="/floating-jacket.webp"
            fill
            preload
            sizes="(max-width: 767px) 96vw, (max-width: 1400px) 64vw, 896px"
            alt="Cobalt technical jacket suspended in midair"
          />
        </div>
        <div className="campaign-copy">
          <p className="campaign-tagline">See it<br /> on you.</p>
          <p className="max-w-55 text-sm leading-relaxed text-white">See how the featured jacket could look on you.</p>
        </div>
        <a href="#scene-showroom" className="campaign-link">
          Open the showroom
          <ArrowDownRight size={20} aria-hidden="true" className="shrink-0" />
        </a>
      </div>
    </section>
  );
}
