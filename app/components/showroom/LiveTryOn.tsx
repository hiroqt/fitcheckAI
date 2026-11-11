"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { createDecartClient } from "@decartai/sdk";

const GARMENTS = {
  bomber: { name: "Floating Brand Bomber", displayName: ["Floating Brand", "Bomber"], image: "/floating-jacket.webp", prompt: "Dress the person in the cobalt technical bomber jacket from the reference. Preserve its ribbed cuffs and hem, sleeve pocket, zipper, the person's face, body shape, pose and background." },
  terno: { name: "The Manila Terno", displayName: ["The Manila", "Terno"], image: "/floating-terno.png", prompt: "Dress the person in the vivid cobalt blue contemporary Filipiniana terno dress in the reference. Preserve their face, body shape, pose and background." },
  barong: { name: "Midnight Barong", displayName: ["Midnight", "Barong"], image: "/floating-barong.png", prompt: "Dress the person in the modern ivory embroidered Filipino barong from the reference. Preserve its embroidery, the person's face, body shape, pose and background." },
} as const;
type Garment = keyof typeof GARMENTS;
const API = "/api/showroom";
const SESSION_SECONDS = 20;
const CONNECTION_TIMEOUT_MS = 25_000;
const FIELD = "min-h-11 w-full border border-[#a3acd2] bg-white px-3 text-[#101b43]";
type Session = Awaited<ReturnType<ReturnType<typeof createDecartClient>["realtime"]["connect"]>>;
type Stage = "form" | "connecting" | "live" | "feedback" | "done";

type Attempt = {
  abort: AbortController;
  stream?: MediaStream;
  session?: Session;
  timer?: ReturnType<typeof setTimeout>;
  countdown?: ReturnType<typeof setInterval>;
  granted: boolean;
  endsAt?: number;
  shown?: boolean;
};

function closeAttempt(attempt: Attempt) {
  attempt.abort.abort();
  clearTimeout(attempt.timer);
  clearInterval(attempt.countdown);
  attempt.stream?.getTracks().forEach((track) => track.stop());
  try { attempt.session?.disconnect(); } catch { /* The camera tracks have already stopped. */ }
}

function post(data: object, signal?: AbortSignal) {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal,
  });
}

export function LiveTryOn() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [garment, setGarment] = useState<Garment>("bomber");
  const [stage, setStage] = useState<Stage>("form");
  const [message, setMessage] = useState("");
  const [remaining, setRemaining] = useState(SESSION_SECONDS);
  const [saving, setSaving] = useState(false);
  const attemptRef = useRef<Attempt | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const status = useRef<HTMLHeadingElement>(null);

  const finish = useCallback((note = "") => {
    const attempt = attemptRef.current;
    if (!attempt) return;
    attemptRef.current = null;
    closeAttempt(attempt);
    if (video.current) video.current.srcObject = null;
    setMessage(note);
    setStage(attempt.granted ? "feedback" : "form");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const state = response.ok ? await response.json() : {};
        if (controller.signal.aborted) return;
        setAvailable(state.available === true);
        if (state.pendingFeedback === true) {
          if (state.garment in GARMENTS) setGarment(state.garment);
          setStage("feedback");
        }
      })
      .catch(() => { if (!controller.signal.aborted) setAvailable(false); });

    function closeWhenHidden() {
      if (document.visibilityState === "hidden") finish("Your camera stopped when you left the page.");
    }

    document.addEventListener("visibilitychange", closeWhenHidden);
    return () => {
      controller.abort();
      document.removeEventListener("visibilitychange", closeWhenHidden);
      const attempt = attemptRef.current;
      attemptRef.current = null;
      if (attempt) closeAttempt(attempt);
    };
  }, [finish]);

  useEffect(() => {
    if (stage === "feedback" || stage === "done") status.current?.focus();
  }, [stage]);

  async function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || attemptRef.current) return;
    const fields = new FormData(event.currentTarget);
    const attempt: Attempt = { abort: new AbortController(), granted: false };
    const current = () => attemptRef.current === attempt;
    attemptRef.current = attempt;
    setMessage("");
    setStage("connecting");
    setRemaining(SESSION_SECONDS);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        finish("Camera access needs a supported browser on a secure connection.");
        return;
      }
      const { createDecartClient, models, noopLogger } = await import("@decartai/sdk");
      if (!current()) return;
      const model = models.realtime("lucy-vton-3.6");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: model.width }, height: { ideal: model.height }, frameRate: model.fps },
        audio: false,
      });
      if (!current()) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      attempt.stream = stream;
      attempt.timer = setTimeout(() => finish("The live preview took too long to start."), CONNECTION_TIMEOUT_MS);
      stream.getVideoTracks().forEach((track) => track.addEventListener("ended", () => {
        if (current()) finish("Your camera disconnected.");
      }, { once: true }));
      const image = await fetch(GARMENTS[garment].image, { signal: attempt.abort.signal }).then((response) => {
        if (!response.ok) throw new Error("Garment unavailable");
        return response.blob();
      });
      const response = await post({
        action: "start",
        garment,
        goal: fields.get("goal"),
        consent: fields.has("consent"),
      }, attempt.abort.signal);
      if (!current()) return;
      if (!response.ok) {
        finish(response.status === 409 ? "This browser has already used its free preview."
          : response.status === 429 ? "All free preview spots have been used."
            : "The live preview is unavailable right now.");
        return;
      }
      attempt.granted = true;
      const { apiKey } = await response.json();
      let token = typeof apiKey === "string" ? apiKey : "";
      const client = createDecartClient({
        telemetry: false,
        logger: noopLogger,
        apiKeyProvider: async () => {
          if (!current() || !token) throw new Error("The preview token has already been used");
          const key = token;
          token = "";
          return key;
        },
      });
      clearTimeout(attempt.timer);
      attempt.endsAt = Date.now() + SESSION_SECONDS * 1000;
      attempt.timer = setTimeout(() => finish(attempt.shown ? "" : "The preview ended before video appeared."), SESSION_SECONDS * 1000);
      const session = await client.realtime.connect(stream, {
        model,
        retries: 0,
        capacityRetryBudgetMs: 0,
        mirror: false,
        initialState: {
          image,
          prompt: { text: GARMENTS[garment].prompt, enhance: false },
          passthrough: false,
        },
        onRemoteStream: (remote) => {
          if (current() && video.current) video.current.srcObject = remote;
        },
        onConnectionChange: (state) => {
          if (current() && (state === "reconnecting" || state === "disconnected")) {
            finish(attempt.shown ? "" : "The live connection ended before video appeared.");
          }
        },
      });
      if (!current()) {
        session.disconnect();
        return;
      }
      attempt.session = session;
      session.on("sessionEnded", () => { if (current()) finish(); });
      session.on("error", () => { if (current()) finish("The live preview was interrupted."); });
    } catch (error) {
      if (!current()) return;
      finish(error instanceof DOMException && error.name === "NotAllowedError"
        ? "Camera permission was denied. Allow camera access and try again."
        : "The live preview couldn’t start. Check your camera and connection.");
    }
  }

  function showFirstFrame() {
    const attempt = attemptRef.current;
    if (!attempt?.endsAt || attempt.shown) return;
    attempt.shown = true;
    const endsAt = attempt.endsAt;
    const updateCountdown = () => setRemaining(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
    updateCountdown();
    setStage("live");
    attempt.countdown = setInterval(updateCountdown, 250);
  }

  async function saveFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      const rating = new FormData(event.currentTarget).get("rating");
      if (!(await post({ action: "feedback", rating })).ok) throw new Error("Feedback unavailable");
      setStage("done");
    } catch {
      setMessage("Feedback couldn’t be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
      <div className="min-w-0 space-y-3">
        <div className="relative isolate aspect-[4/3] min-w-0 overflow-hidden bg-[#0038ff] text-white sm:aspect-video">
        {stage !== "live" && (
          <>
            <div aria-hidden="true" className="absolute inset-x-0 top-[10%] z-0 text-center text-[clamp(2rem,7vw,5.5rem)] font-black italic uppercase leading-[0.82] tracking-[-0.055em] text-white/30">
              <span className="block">{GARMENTS[garment].displayName[0]}</span>
              <span className="block">{GARMENTS[garment].displayName[1]}</span>
            </div>
            <Image src={GARMENTS[garment].image} alt={`${GARMENTS[garment].name}, illustrative fashion concept`} fill
              sizes="(max-width: 1023px) 100vw, 800px" className="z-10 object-contain p-5" />
          </>
        )}
        <video ref={video} autoPlay muted playsInline onPlaying={showFirstFrame}
          aria-label="Live AI try-on result" aria-hidden={stage !== "live"}
          className={`absolute inset-0 size-full -scale-x-100 object-contain ${stage === "live" ? "" : "opacity-0"}`} />
        {stage === "live" && (
          <div className="absolute inset-x-0 bottom-0 flex justify-between gap-3 bg-[#15152f] px-4 py-2 text-sm">
            <span>Live AI preview</span>
            <span className="tabular-nums">{remaining}s left</span>
          </div>
        )}
        </div>

        {stage === "form" && (
          <div role="group" aria-label="Choose a garment" className="mx-auto grid w-full max-w-[600px] grid-cols-3 gap-2">
            {(Object.entries(GARMENTS) as [Garment, typeof GARMENTS[Garment]][]).map(([id, item]) => (
              <button key={id} type="button" aria-pressed={garment === id} onClick={() => setGarment(id)}
                className="group relative aspect-[4/3] overflow-hidden border border-white/30 bg-[#0038ff] text-left text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-pressed:border-white aria-pressed:ring-1 aria-pressed:ring-white">
                <span aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[clamp(.65rem,1.4vw,1rem)] font-black italic uppercase leading-[0.9] tracking-[-0.045em] text-white/35">
                  <span className="block">{item.displayName[0]}</span><span className="block">{item.displayName[1]}</span>
                </span>
                <Image src={item.image} alt="" fill sizes="(max-width: 1023px) 30vw, 12vw" className="z-10 object-contain p-1 transition-transform group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 z-20 truncate bg-[#0b0c23]/95 px-1 py-1 text-center text-[0.64rem] leading-tight text-white sm:text-xs">{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        {stage === "form" && (
          <form onSubmit={start} className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">{GARMENTS[garment].name}</h3>
            <p className="text-sm text-[#51516c]">Choose a look for one free live preview, up to 20 seconds.</p>
            <p className="text-xs text-[#51516c]">Illustrative collection concepts. Final previews can vary by garment.</p>
            <p className="text-xs text-[#51516c]">Live previews show styling. Use the brand’s size chart to choose a size.</p>
            <label className="block text-sm font-semibold">
              What would you like to see?
              <select name="goal" defaultValue="" required className={`mt-1 ${FIELD}`}>
                <option value="" disabled>Choose an answer</option>
                <option value="style">How the jacket looks on me</option>
                <option value="details">How it looks when I move</option>
                <option value="curious">I’m exploring the showroom</option>
              </select>
            </label>
            <p id="showroom-camera-consent" className="text-sm leading-relaxed text-[#51516c]">
              Your live camera video and selected garment image are sent to an external AI service to generate this preview. FitCheck saves your answers and feedback. Your microphone stays off.
            </p>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="consent" required aria-describedby="showroom-camera-consent" className="mt-0.5 size-4 shrink-0 accent-[#0038ff]" />
              I’m 18 or older and agree to share my camera video with the external AI service.
            </label>
            <button type="submit" disabled={!available} className="editorial-action disabled:cursor-not-allowed disabled:opacity-60">Start free live try-on</button>
            {available !== true && <p role="status" className="text-sm text-[#51516c]">{available === null ? "Checking availability…" : "Live try-on is currently unavailable."}</p>}
          </form>
        )}
        {(stage === "connecting" || stage === "live") && (
          <div className="space-y-4">
            <h3 role="status" className="text-2xl font-bold">{stage === "live" ? "Try moving your shoulders" : "Starting your live preview…"}</h3>
            <p className="text-sm text-[#51516c]">Keep your upper body in frame.</p>
            <button type="button" onClick={() => finish()} className="editorial-action">{stage === "live" ? "Stop preview" : "Cancel preview"}</button>
          </div>
        )}
        {stage === "feedback" && (
          <form onSubmit={saveFeedback} className="space-y-4">
            <h3 ref={status} tabIndex={-1} className="text-2xl font-bold">How was the try-on?</h3>
            <label className="block text-sm font-semibold">
              Did it help you see how the jacket would look on you?
              <select name="rating" defaultValue="" required className={`mt-1 ${FIELD}`}>
                <option value="" disabled>Choose an answer</option>
                <option value="yes">Yes</option>
                <option value="somewhat">Somewhat</option>
                <option value="no">No</option>
              </select>
            </label>
            <button type="submit" disabled={saving} className="editorial-action disabled:opacity-60">{saving ? "Saving…" : "Send feedback"}</button>
          </form>
        )}
        {stage === "done" && <h3 ref={status} tabIndex={-1} className="text-2xl font-bold">Thanks for your feedback.</h3>}
        {message && <p role="status" className="mt-4 text-sm text-[#51516c]">{message}</p>}
      </div>
    </div>
  );
}
