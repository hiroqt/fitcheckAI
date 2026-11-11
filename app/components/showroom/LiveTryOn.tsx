"use client";

import Image from "next/image";
import Script from "next/script";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { createDecartClient } from "@decartai/sdk";
import { SocialLinks } from "../SocialLinks";

const GARMENTS = {
  bomber: { name: "Floating Brand Bomber", displayName: ["Floating Brand", "Bomber"], image: "/floating-jacket.webp", prompt: "Dress the person in the cobalt technical bomber jacket from the reference. Preserve its ribbed cuffs and hem, sleeve pocket, zipper, face, body shape, pose and background." },
  terno: { name: "The Manila Terno", displayName: ["The Manila", "Terno"], image: "/floating-terno.png", prompt: "Dress the person in the vivid cobalt blue contemporary Filipiniana terno dress in the reference. Preserve the person's face, body shape, pose and background." },
  barong: { name: "Midnight Barong", displayName: ["Midnight", "Barong"], image: "/floating-barong.png", prompt: "Dress the person in the modern ivory embroidered Filipino barong from the reference. Preserve its embroidery, the person's face, body shape, pose and background." },
} as const;
type Garment = keyof typeof GARMENTS;
type Stage = "choose" | "survey" | "sign-in" | "upload" | "connecting" | "live" | "finished" | "done";
type PreviewMode = "live" | "photo";
type Survey = {
  name: string;
  contactEmail: string;
  monthlySpend: string;
  biggestChallenge: string;
  biggestChallengeOther: string;
  skippedPurchase: string;
  usefulness: string;
  willingnessToPay: string;
  purchaseLikelihood: string;
};
const EMPTY_SURVEY: Survey = {
  name: "", contactEmail: "", monthlySpend: "", biggestChallenge: "", biggestChallengeOther: "",
  skippedPurchase: "", usefulness: "", willingnessToPay: "", purchaseLikelihood: "",
};
type GoogleCredential = { credential: string };
type GoogleIdApi = { initialize: (options: { client_id: string; callback: (response: GoogleCredential) => void }) => void; renderButton: (element: HTMLElement, options: Record<string, string>) => void };
declare global { interface Window { google?: { accounts: { id: GoogleIdApi } } } }

const API = "/api/showroom";
const SESSION_SECONDS = 15;
const CONNECTION_TIMEOUT_MS = 12_000;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const FIELD = "min-h-11 w-full border border-[#a3acd2] bg-white px-3 text-[#101b43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]";
const CHALLENGES = ["Unsure whether the size will fit", "Unsure how the clothing will look on me", "Product looks different from the photos", "Difficult to compare styles", "Other"];
type RealtimeSession = Awaited<ReturnType<ReturnType<typeof createDecartClient>["realtime"]["connect"]>>;
type Availability = { surveyAvailable: boolean; previewAvailable: boolean; googleClientId?: string };
type Attempt = {
  abort: AbortController;
  credential: string;
  reservationId?: string;
  stream?: MediaStream;
  canvas?: HTMLCanvasElement;
  stopFrames?: () => void;
  session?: RealtimeSession;
  timer?: ReturnType<typeof setTimeout>;
  countdown?: ReturnType<typeof setInterval>;
  endsAt?: number;
  committed: boolean;
  shown: boolean;
};

function post(data: object, signal?: AbortSignal, keepalive = false) {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal,
    keepalive,
  });
}

function LoadingSpinner({ className = "size-4" }: { className?: string }) {
  return <span aria-hidden="true" className={`shrink-0 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin ${className}`} />;
}

function stopAttempt(attempt: Attempt) {
  attempt.abort.abort();
  clearTimeout(attempt.timer);
  clearInterval(attempt.countdown);
  attempt.stopFrames?.();
  attempt.stream?.getTracks().forEach((track) => track.stop());
  try { attempt.session?.disconnect(); } catch { /* Stop local frames even when the provider is already disconnected. */ }
  if (attempt.canvas) { attempt.canvas.width = 0; attempt.canvas.height = 0; }
}

async function photoStream(photoUrl: string, width: number, height: number, fps: number) {
  // shortcut: repeat one photo for Lucy VTON; replace with a native still-photo model after quality validation.
  const image = new window.Image();
  image.src = photoUrl;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context || !canvas.captureStream) throw new Error("Photo preview is not supported in this browser");
  const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
  const photoWidth = Math.round(image.naturalWidth * scale);
  const photoHeight = Math.round(image.naturalHeight * scale);
  const draw = () => {
    context.fillStyle = "#15152f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, (canvas.width - photoWidth) / 2, (canvas.height - photoHeight) / 2, photoWidth, photoHeight);
  };
  draw();
  let frame = requestAnimationFrame(function repeatFrame() { draw(); frame = requestAnimationFrame(repeatFrame); });
  const stream = canvas.captureStream(fps);
  return {
    canvas,
    stream,
    stopFrames: () => cancelAnimationFrame(frame),
  };
}

export function LiveTryOn() {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [stage, setStage] = useState<Stage>("choose");
  const [mode, setMode] = useState<PreviewMode>("live");
  const [garment, setGarment] = useState<Garment>("bomber");
  const [photo, setPhoto] = useState<{ url: string } | null>(null);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [surveyDraft, setSurveyDraft] = useState<Survey>(EMPTY_SURVEY);
  const [surveyStep, setSurveyStep] = useState(0);
  const [credential, setCredential] = useState("");
  const [message, setMessage] = useState("");
  const [remaining, setRemaining] = useState(SESSION_SECONDS);
  const [saving, setSaving] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [connectionLabel, setConnectionLabel] = useState("");
  const [buffering, setBuffering] = useState(false);
  const [consented, setConsented] = useState(false);
  const attemptRef = useRef<Attempt | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const signInButton = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (response.ok && !controller.signal.aborted) setAvailability(await response.json());
        else if (!controller.signal.aborted) setAvailability({ surveyAvailable: false, previewAvailable: false });
      })
      .catch(() => { if (!controller.signal.aborted) setAvailability({ surveyAvailable: false, previewAvailable: false }); });
    return () => controller.abort();
  }, []);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);

  const release = useCallback((attempt: Attempt) => {
    if (!attempt.committed && attempt.reservationId) {
      void post({ action: "release", credential: attempt.credential, reservationId: attempt.reservationId }, undefined, true).catch(() => undefined);
    }
  }, []);

  const finish = useCallback((note = "") => {
    const attempt = attemptRef.current;
    if (!attempt) return;
    attemptRef.current = null;
    release(attempt);
    stopAttempt(attempt);
    if (video.current) video.current.srcObject = null;
    setMessage(note);
    setCredential(attempt.committed ? "" : attempt.credential);
    if (attempt.committed) {
      setPhoto(null);
      setConsented(false);
      setStage("finished");
    } else {
      setStage("upload");
    }
  }, [release]);

  useEffect(() => {
    function closeWhenHidden() {
      if (document.visibilityState === "hidden") finish("The preview stopped when you left this page.");
    }
    document.addEventListener("visibilitychange", closeWhenHidden);
    return () => {
      document.removeEventListener("visibilitychange", closeWhenHidden);
      const attempt = attemptRef.current;
      attemptRef.current = null;
      if (attempt) { release(attempt); stopAttempt(attempt); }
    };
  }, [finish, release]);

  useEffect(() => {
    if (stage === "sign-in" || stage === "upload" || stage === "finished" || stage === "done") status.current?.focus();
  }, [stage]);

  const recordSurvey = useCallback(async (token: string) => {
    if (!survey) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await post({ action: "survey", credential: token, survey });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The survey could not be saved.");
      setCredential(token);
      if (result.alreadyUsed) {
        setMessage("Your answers were saved. This Google account can try again one hour after its last preview started.");
        setStage("done");
      } else if (!result.previewAvailable) {
        setMessage("Your answers were saved. The photo try-on is being prepared and is not available yet.");
        setStage("done");
      } else {
        setStage("upload");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The survey could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [survey]);

  function initializeGoogleSignIn() {
    setSignInLoading(false);
    const clientId = availability?.googleClientId;
    if (!clientId || !signInButton.current || !window.google) {
      setMessage("Google sign-in is unavailable. Reload the page and try again.");
      return;
    }
    signInButton.current.replaceChildren();
    window.google.accounts.id.initialize({ client_id: clientId, callback: (result) => { if (result.credential) void recordSurvey(result.credential); } });
    window.google.accounts.id.renderButton(signInButton.current, { type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "rectangular", width: "320" });
  }

  function submitSurvey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (surveyStep < 6) {
      setSurveyStep((step) => step + 1);
      return;
    }
    setSurvey({ ...surveyDraft, name: surveyDraft.name.trim(), contactEmail: surveyDraft.contactEmail.trim(), biggestChallengeOther: surveyDraft.biggestChallengeOther.trim() });
    setMessage("");
    setSignInLoading(Boolean(availability?.googleClientId));
    setStage("sign-in");
  }

  function updateSurveyDraft(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.currentTarget;
    setSurveyDraft((draft) => ({ ...draft, [name]: value, ...(name === "biggestChallenge" && value !== "Other" ? { biggestChallengeOther: "" } : {}) }));
  }

  function startSurvey(nextMode: PreviewMode) {
    setMode(nextMode);
    setSurveyDraft(EMPTY_SURVEY);
    setSurveyStep(0);
    setMessage("");
    setStage("survey");
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    setMessage("");
    if (!file) return;
    if (!PHOTO_TYPES.has(file.type) || file.size > MAX_PHOTO_BYTES) {
      setPhoto(null);
      setMessage("Choose a JPG, PNG, or WebP photo up to 10 MB.");
      return;
    }
    setPhoto({ url: URL.createObjectURL(file) });
  }

  async function showFirstFrame() {
    const attempt = attemptRef.current;
    if (!attempt || attempt.shown || !attempt.reservationId) return;
    attempt.shown = true;
    clearTimeout(attempt.timer);
    try {
      if (!(await post({ action: "commit", credential: attempt.credential, reservationId: attempt.reservationId }, attempt.abort.signal)).ok) {
        finish("The try-on could not be secured. Your try has been restored.");
        return;
      }
      attempt.committed = true;
      attempt.endsAt = Date.now() + SESSION_SECONDS * 1000;
      setStage("live");
      const updateCountdown = () => setRemaining(Math.max(0, Math.ceil(((attempt.endsAt ?? Date.now()) - Date.now()) / 1000)));
      updateCountdown();
      attempt.countdown = setInterval(updateCountdown, 250);
      attempt.timer = setTimeout(() => finish(), SESSION_SECONDS * 1000);
    } catch {
      finish("The try-on could not be secured. Your try has been restored.");
    }
  }

  async function start() {
    if ((mode === "photo" && !photo) || !credential || !consented || !availability?.previewAvailable || attemptRef.current) return;
    const attempt: Attempt = { abort: new AbortController(), credential, committed: false, shown: false };
    attemptRef.current = attempt;
    setMessage("");
    setRemaining(SESSION_SECONDS);
    setBuffering(false);
    setConnectionLabel(mode === "photo" ? "Preparing your photo…" : "Opening your camera…");
    setStage("connecting");
    try {
      const { createDecartClient, models, noopLogger, resolveFpsNumber } = await import("@decartai/sdk");
      const model = models.realtime("lucy-vton-3.6");
      let stream: MediaStream;
      if (mode === "photo" && photo) {
        const source = await photoStream(photo.url, model.width, model.height, resolveFpsNumber(model.fps));
        if (attemptRef.current !== attempt) { source.stream.getTracks().forEach((track) => track.stop()); source.stopFrames(); source.canvas.width = 0; return; }
        attempt.canvas = source.canvas;
        attempt.stopFrames = source.stopFrames;
        stream = source.stream;
      } else {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera access needs a supported browser on a secure connection.");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: model.width }, height: { ideal: model.height }, frameRate: model.fps },
          audio: false,
        });
        if (attemptRef.current !== attempt) { stream.getTracks().forEach((track) => track.stop()); return; }
        stream.getVideoTracks().forEach((track) => track.addEventListener("ended", () => {
          if (attemptRef.current === attempt) finish("Your camera disconnected.");
        }, { once: true }));
      }
      if (attemptRef.current !== attempt) { stream.getTracks().forEach((track) => track.stop()); return; }
      attempt.stream = stream;
      setConnectionLabel("Connecting your preview…");

      const image = await fetch(GARMENTS[garment].image, { signal: attempt.abort.signal }).then((response) => {
        if (!response.ok) throw new Error("Garment unavailable");
        return response.blob();
      });
      const response = await post({ action: "start", credential, garment, consent: true }, attempt.abort.signal);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The live preview is not available right now.");
      attempt.reservationId = result.reservationId;
      attempt.timer = setTimeout(() => finish("The photo preview could not start. Your try has been restored."), CONNECTION_TIMEOUT_MS);

      let token = typeof result.apiKey === "string" ? result.apiKey : "";
      const client = createDecartClient({
        telemetry: false,
        logger: noopLogger,
        apiKeyProvider: async () => {
          if (!token || attemptRef.current !== attempt) throw new Error("The one-use preview token is no longer available");
          const key = token;
          token = "";
          return key;
        },
      });
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
          if (attemptRef.current !== attempt || !video.current) return;
          video.current.srcObject = remote;
          if (!attempt.shown) setConnectionLabel("Waiting for your try-on video…");
        },
        onConnectionChange: (state) => {
          if (attemptRef.current === attempt && (state === "reconnecting" || state === "disconnected")) {
            finish(attempt.shown ? "The preview connection ended early." : "The photo preview could not start. Your try has been restored.");
          }
        },
      });
      if (attemptRef.current !== attempt) { session.disconnect(); return; }
      attempt.session = session;
      session.on("sessionEnded", () => { if (attemptRef.current === attempt) finish(); });
      session.on("error", () => { if (attemptRef.current === attempt) finish("The preview was interrupted."); });
    } catch (error) {
      if (attemptRef.current !== attempt) return;
      finish(error instanceof Error ? `${error.message} Your try has been restored.` : "The photo preview could not start. Your try has been restored.");
    }
  }

  const surveyUnavailable = availability !== null && !availability.surveyAvailable;
  const previewUnavailable = availability !== null && !availability.previewAvailable;
  const previewLoading = stage === "connecting" ? connectionLabel : stage === "live" && buffering ? "Buffering your preview…" : "";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
      <div className="min-w-0 space-y-3">
        <div className="relative isolate aspect-[4/3] min-w-0 overflow-hidden rounded-md bg-[#15152f] text-white shadow-xl sm:aspect-video">
          <span aria-hidden="true" className="viewfinder-bracket viewfinder-top-left text-white/50" />
          <span aria-hidden="true" className="viewfinder-bracket viewfinder-top-right text-white/50" />
          <span aria-hidden="true" className="viewfinder-bracket viewfinder-bottom-left text-white/50" />
          <span aria-hidden="true" className="viewfinder-bracket viewfinder-bottom-right text-white/50" />
          {photo && stage !== "done" && <Image src={photo.url} alt="Your selected body photo, held in this page for preview" fill sizes="(max-width: 1023px) 100vw, 800px" unoptimized className={`object-contain ${stage === "live" ? "opacity-0" : ""}`} />}
          {!photo && stage !== "live" && (
            <>
              <div aria-hidden="true" className="absolute inset-x-0 top-[10%] z-0 text-center text-[clamp(2rem,7vw,5.5rem)] font-black italic uppercase leading-[0.82] tracking-[-0.055em] text-white/30">
                <span className="block">{GARMENTS[garment].displayName[0]}</span>
                <span className="block">{GARMENTS[garment].displayName[1]}</span>
              </div>
              <Image src={GARMENTS[garment].image} alt={`${GARMENTS[garment].name}, illustrative fashion concept`} fill sizes="(max-width: 1023px) 100vw, 800px" className="z-10 object-contain p-5" />
              <div className="absolute inset-x-0 bottom-0 z-20 bg-[#15152f]/90 px-4 py-3 text-sm text-white">
                <p className="font-semibold">{GARMENTS[garment].name}</p>
                <p className="mt-1 text-white/75">Illustrative garment preview</p>
              </div>
            </>
          )}
          <video ref={video} autoPlay muted playsInline onWaiting={() => { if (stage === "live") setBuffering(true); }}
            onPlaying={() => { setBuffering(false); void showFirstFrame(); }} aria-label="15-second AI-generated virtual try-on preview" aria-hidden={stage !== "live"}
            className={`absolute inset-0 size-full object-contain ${stage === "live" ? "" : "opacity-0"}`} />
          <div role="status" className={previewLoading ? "absolute inset-0 z-30 grid place-items-center bg-[#15152f]/90 px-4 text-center" : "sr-only"}>
            {previewLoading && (
              <div className="grid justify-items-center gap-3">
                <LoadingSpinner className="size-9 text-[#99b0ff]" />
                <p className="text-sm font-semibold sm:text-base">{previewLoading}</p>
              </div>
            )}
          </div>
          {stage === "live" && (
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-3 bg-[#15152f] px-4 py-2 text-sm">
              <span>AI style preview</span><span className="tabular-nums">{remaining}s left</span>
            </div>
          )}
        </div>
        <p className="text-sm text-[#51516c]">A visual style preview only. Check the seller’s size chart for fit.</p>
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        {(stage === "choose" || stage === "survey") && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">Choose a preview</h3>
            <p className="text-sm text-[#51516c]">Choose live camera or upload a photo. Each verified Google account can use one 15-second preview per hour across both options.</p>
            <div role="group" aria-label="Choose a garment" className="grid grid-cols-3 gap-2">
              {(Object.entries(GARMENTS) as [Garment, typeof GARMENTS[Garment]][]).map(([id, item]) => (
                <button key={id} type="button" aria-pressed={garment === id} onClick={() => setGarment(id)}
                  className="group relative aspect-[4/3] overflow-hidden border border-[#a3acd2] bg-[#0038ff] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] aria-pressed:border-[#0038ff] aria-pressed:ring-2 aria-pressed:ring-[#0038ff]">
                  <span aria-hidden="true" className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 text-center text-[clamp(.65rem,1.4vw,1rem)] font-black italic uppercase leading-[0.9] tracking-[-0.045em] text-white/35">
                    <span className="block">{item.displayName[0]}</span><span className="block">{item.displayName[1]}</span>
                  </span>
                  <Image src={item.image} alt="" fill sizes="(max-width: 1023px) 30vw, 12vw" className="z-10 object-contain p-1" />
                  <span className="absolute inset-x-0 bottom-0 z-20 truncate bg-[#0b0c23]/95 px-1 py-1 text-center text-[0.64rem] leading-tight text-white sm:text-xs">{item.name}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => startSurvey("live")} className="editorial-action w-full text-left">Live camera preview</button>
            <button type="button" onClick={() => startSurvey("photo")} className="min-h-11 w-full border border-[#a3acd2] px-4 py-3 text-left font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]">Upload a photo</button>
            {stage === "choose" && availability === null && <p role="status" className="flex items-center gap-2 text-sm text-[#51516c]"><LoadingSpinner />Checking preview availability…</p>}
            {availability && !availability.previewAvailable && <p role="status" className="text-sm text-[#51516c]">Preview setup is not ready yet. The options will stay unavailable until integrations and provider approval are complete.</p>}
          </div>
        )}

        {stage === "survey" && (
          <Dialog open onOpenChange={(open) => { if (!open) setStage("choose"); }}>
            <DialogContent
              style={{ display: "flex", flexDirection: "column", maxHeight: "calc(100dvh - 2rem)", overflow: "hidden" }}
              className="w-[calc(100%-2rem)] gap-4 rounded-none border border-[#a3acd2] bg-white p-5 text-[#101b43] sm:max-w-2xl sm:p-8"
            >
              <DialogTitle className="pr-8 text-2xl font-bold tracking-tight">FitCheck Market Validation Survey</DialogTitle>
              <DialogDescription className="text-sm text-[#51516c]">One quick question at a time. Your answers are saved to FitCheck’s private survey Sheet after Google sign-in.</DialogDescription>
              <div role="progressbar" aria-label="Survey progress" aria-valuemin={1} aria-valuemax={7} aria-valuenow={surveyStep + 1} className="h-1.5 w-full bg-[#e8ebf6]">
                <div className="h-full bg-[#0038ff] transition-[width]" style={{ width: `${((surveyStep + 1) / 7) * 100}%` }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#51516c]">Step {surveyStep + 1} of 7</p>
              <form onSubmit={submitSurvey} className="flex min-h-0 flex-col gap-5">
                <div className="min-h-[10rem] flex-1 space-y-4">
                  {surveyStep === 0 && <>
                    <label className="block text-sm font-semibold">Name <span aria-hidden="true">*</span>
                      <input name="name" autoComplete="name" value={surveyDraft.name} onChange={updateSurveyDraft} required maxLength={120} className={`mt-1 ${FIELD}`} />
                    </label>
                    <label className="block text-sm font-semibold">Email Address (Optional)
                      <input name="contactEmail" type="email" autoComplete="email" value={surveyDraft.contactEmail} onChange={updateSurveyDraft} className={`mt-1 ${FIELD}`} />
                    </label>
                  </>}
                  {surveyStep === 1 && <label className="block text-sm font-semibold">How much do you typically spend on clothes online per month?
                    <select name="monthlySpend" value={surveyDraft.monthlySpend} onChange={updateSurveyDraft} required className={`mt-1 ${FIELD}`}>
                      <option value="" disabled>Choose an answer</option>
                      {["Below ₱500", "₱500–₱999", "₱1,000–₱1,999", "₱2,000–₱3,999", "₱4,000 or more"].map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>}
                  {surveyStep === 2 && <>
                    <label className="block text-sm font-semibold">What is your biggest challenge when buying clothes online?
                      <select name="biggestChallenge" value={surveyDraft.biggestChallenge} onChange={updateSurveyDraft} required className={`mt-1 ${FIELD}`}>
                        <option value="" disabled>Choose an answer</option>{CHALLENGES.map((value) => <option key={value}>{value}</option>)}
                      </select>
                    </label>
                    {surveyDraft.biggestChallenge === "Other" && <label className="block text-sm font-semibold">What other challenge do you face?
                      <input name="biggestChallengeOther" value={surveyDraft.biggestChallengeOther} onChange={updateSurveyDraft} required maxLength={300} className={`mt-1 ${FIELD}`} />
                    </label>}
                  </>}
                  {surveyStep === 3 && <label className="block text-sm font-semibold">Have you ever decided not to buy clothing online because you were unsure how it would look on you?
                    <select name="skippedPurchase" value={surveyDraft.skippedPurchase} onChange={updateSurveyDraft} required className={`mt-1 ${FIELD}`}>
                      <option value="" disabled>Choose an answer</option>{["Yes, frequently", "Yes, sometimes", "Rarely", "Never"].map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>}
                  {surveyStep === 4 && <label className="block text-sm font-semibold">How useful would a live virtual try-on feature be if it let you preview clothes on yourself using your camera?
                    <select name="usefulness" value={surveyDraft.usefulness} onChange={updateSurveyDraft} required className={`mt-1 ${FIELD}`}>
                      <option value="" disabled>Choose a rating</option>{["1 — Not useful", "2", "3", "4", "5 — Extremely useful"].map((value, index) => <option key={value} value={String(index + 1)}>{value}</option>)}
                    </select>
                  </label>}
                  {surveyStep === 5 && <label className="block text-sm font-semibold">Would you pay for a 30-second virtual clothing preview?
                    <select name="willingnessToPay" value={surveyDraft.willingnessToPay} onChange={updateSurveyDraft} required className={`mt-1 ${FIELD}`}>
                      <option value="" disabled>Choose an answer</option>{["₱1–₱49", "₱50–₱99", "₱100–₱149", "₱150 or more", "No, I would only use it if free"].map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>}
                  {surveyStep === 6 && <label className="block text-sm font-semibold">Would a virtual clothing preview make you more likely to purchase from an online clothing brand?
                    <select name="purchaseLikelihood" value={surveyDraft.purchaseLikelihood} onChange={updateSurveyDraft} required className={`mt-1 ${FIELD}`}>
                      <option value="" disabled>Choose an answer</option>{["Much more likely", "Somewhat more likely", "No difference", "Less likely"].map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>}
                </div>
                {surveyUnavailable && <p role="status" className="text-sm text-[#51516c]">The survey Sheet connection is not configured yet, so answers cannot be submitted.</p>}
                <div className="flex items-center justify-between gap-3">
                  <button type="button" onClick={() => surveyStep === 0 ? setStage("choose") : setSurveyStep((step) => step - 1)} className="min-h-11 underline underline-offset-4">{surveyStep === 0 ? "Back to preview" : "Back"}</button>
                  <button type="submit" disabled={saving || (surveyStep === 6 && (availability === null || surveyUnavailable))} className="editorial-action disabled:cursor-not-allowed disabled:opacity-60">
                    {surveyStep === 6 && availability === null && <LoadingSpinner />}
                    {surveyStep < 6 ? "Continue" : availability === null ? "Checking setup…" : surveyUnavailable ? "Survey unavailable" : "Continue to Google sign-in"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {stage === "sign-in" && (
          <div className="space-y-4">
            <h3 ref={status} tabIndex={-1} className="text-2xl font-bold tracking-tight">Save your answers</h3>
            <p className="text-sm text-[#51516c]">Sign in with Google. FitCheck uses your verified Google email to allow one try-on per hour; it is not added to the survey response sheet.</p>
            {availability?.googleClientId && <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={initializeGoogleSignIn}
              onError={() => { setSignInLoading(false); setMessage("Google sign-in is unavailable. Reload the page and try again."); }} />}
            <div ref={signInButton} aria-label="Continue with Google" hidden={saving} />
            {(saving || signInLoading) && <p role="status" className="flex items-center gap-2 text-sm text-[#51516c]"><LoadingSpinner />{saving ? "Saving your answers…" : "Loading Google sign-in…"}</p>}
            {availability?.googleClientId && !saving && !signInLoading && <p className="text-xs text-[#51516c]">Only Gmail or Google Workspace accounts with a verified email can use a preview.</p>}
            <button type="button" disabled={saving} onClick={() => { setMessage(""); setStage("survey"); }} className="min-h-11 underline underline-offset-4 disabled:opacity-60">Edit answers</button>
          </div>
        )}

        {stage === "upload" && (
          <div className="space-y-4">
            <h3 ref={status} tabIndex={-1} className="text-2xl font-bold tracking-tight">{mode === "photo" ? "Choose your photo and look" : "Choose your look"}</h3>
            {mode === "photo" ? <>
              <p className="text-sm text-[#51516c]">Use a clear, front-facing photo with the person’s upper body visible. JPG, PNG, or WebP up to 10 MB.</p>
              <label className="block text-sm font-semibold">Body photo
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:border-0 file:bg-[#0038ff] file:px-4 file:font-semibold file:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]" />
              </label>
            </> : <p className="text-sm text-[#51516c]">Your camera turns on only after you agree and start the preview. Audio stays off.</p>}
            <p id="showroom-photo-consent" className="text-sm leading-relaxed text-[#51516c]">
              {mode === "photo" ? "Your photo and the selected garment image are streamed from your browser to Decart to generate the preview. FitCheck does not save either image or the generated video. The preview and photo are cleared from this page when you stop, finish, or close it." : "Your camera video and the selected garment image are streamed from your browser to Decart to generate the preview. FitCheck does not save the video or generated result. The camera stops when you stop, finish, or close the page."} Decart’s handling follows its provider terms; public use stays disabled until those terms are approved.
            </p>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} aria-describedby="showroom-photo-consent" className="mt-0.5 size-4 shrink-0 accent-[#0038ff]" />
              I’m 18 or older and agree to send {mode === "photo" ? "this photo" : "my camera video"} to Decart for a 15-second style preview.
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => void start()} disabled={(mode === "photo" && !photo) || !consented || saving || previewUnavailable} className="editorial-action disabled:cursor-not-allowed disabled:opacity-60">Start 15-second try-on</button>
              {photo && <button type="button" onClick={() => { setPhoto(null); setConsented(false); setMessage(""); }} className="min-h-11 underline underline-offset-4">Remove photo</button>}
            </div>
            <button type="button" onClick={() => { setStage("choose"); setPhoto(null); setConsented(false); setMessage(""); }} className="min-h-11 underline underline-offset-4">Choose a different preview</button>
            {previewUnavailable && <p role="status" className="text-sm text-[#51516c]">Try-on previews are not enabled yet. They will stay unavailable until provider approval and setup are complete.</p>}
          </div>
        )}

        {(stage === "connecting" || stage === "live") && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{stage === "live" ? "Your look, in motion" : "Starting your try-on"}</h3>
            <p className="text-sm text-[#51516c]">{stage === "live" ? "Your preview ends after 15 seconds." : "Keep this page open while the preview connects."}</p>
            <button type="button" onClick={() => finish()} className="editorial-action">{stage === "live" ? "Stop preview" : "Cancel preview"}</button>
          </div>
        )}

        {(stage === "finished" || stage === "done") && <h3 ref={status} tabIndex={-1} className="text-2xl font-bold tracking-tight">Thanks for taking part.</h3>}
        {message && <p role="status" className="mt-4 text-sm text-[#51516c]">{message}</p>}
        {stage === "finished" && (
          <div className="mt-5 w-fit max-w-full space-y-2 bg-[#101b43] px-4 py-3 text-white">
            <h4 className="text-sm font-semibold">Follow us</h4>
            <SocialLinks />
          </div>
        )}
      </div>
    </div>
  );
}
