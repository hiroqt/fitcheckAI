import { LiveTryOn } from "./showroom/LiveTryOn";

export function InteractiveShowroom() {
  return (
    <section
      id="scene-showroom"
      aria-labelledby="showroom-title"
      className="editorial-section scroll-mt-8 text-[#101b43]"
    >
      <div className="border-b border-[#d5d5e4] pb-6">
        <h2 id="showroom-title" className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl">
          Try on a look.
        </h2>
      </div>
      <div className="mt-4">
        <LiveTryOn />
      </div>
    </section>
  );
}
