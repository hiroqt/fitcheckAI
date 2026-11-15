/**
 * The try-on survey is managed in FitCheck Ops (fitcheck_sys `docs/contracts/tryon-api.md`).
 * The server fetches the published definition (`GET /public/v1/tryon/survey`, cached ≤60 s) and the
 * browser renders one question per step from it. Ops validates every answer again on submit.
 */

export type SurveyChoice = { id: string; label: string };
export type SurveyQuestion = {
  id: string;
  type: "single" | "multi" | "rating" | "text" | "name" | "email";
  label: string;
  help?: string;
  required: boolean;
  choices?: SurveyChoice[];
  other?: boolean;
  maxSelect?: number;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
};
export type SurveyDefinition = { version: number; title: string; intro: string; questions: SurveyQuestion[] };

/** Answer ids, or text; `other[qid]` holds the "Other" text. */
export type SurveyAnswers = { answers: Record<string, string | string[]>; other: Record<string, string> };

export const OTHER = "other";
export const MAX_QUESTIONS = 12;

const TYPES = new Set(["single", "multi", "rating", "text", "name", "email"]);

/** Defensive parse of the Ops response: anything unexpected makes the survey unavailable. */
export function parseDefinition(value: unknown): SurveyDefinition | undefined {
  if (typeof value !== "object" || value === null) return;
  const d = value as Record<string, unknown>;
  if (typeof d.version !== "number" || typeof d.title !== "string" || typeof d.intro !== "string" || !Array.isArray(d.questions)) return;
  if (d.questions.length === 0 || d.questions.length > MAX_QUESTIONS) return;
  const questions: SurveyQuestion[] = [];
  for (const raw of d.questions as unknown[]) {
    if (typeof raw !== "object" || raw === null) return;
    const q = raw as Record<string, unknown>;
    if (typeof q.id !== "string" || typeof q.label !== "string" || typeof q.type !== "string" || !TYPES.has(q.type) || typeof q.required !== "boolean") return;
    const choices = Array.isArray(q.choices)
      ? (q.choices as unknown[]).flatMap((c) => (typeof c === "object" && c !== null && typeof (c as SurveyChoice).id === "string" && typeof (c as SurveyChoice).label === "string" ? [{ id: (c as SurveyChoice).id, label: (c as SurveyChoice).label }] : []))
      : undefined;
    const num = (k: string) => (typeof q[k] === "number" ? (q[k] as number) : undefined);
    const text = (k: string) => (typeof q[k] === "string" ? (q[k] as string) : undefined);
    questions.push({
      id: q.id, type: q.type as SurveyQuestion["type"], label: q.label, required: q.required, help: text("help"), choices,
      other: q.other === true, maxSelect: num("maxSelect"), min: num("min"), max: num("max"), minLabel: text("minLabel"), maxLabel: text("maxLabel"),
    });
  }
  return { version: d.version, title: d.title, intro: d.intro, questions };
}

/** Why the current step can't continue (custom checks the browser's `required` can't express), or "". */
export function stepProblem(q: SurveyQuestion, s: SurveyAnswers): string {
  const value = s.answers[q.id];
  const picked = Array.isArray(value) ? value : value ? [value] : [];
  if (q.required && picked.length === 0) return "Choose an answer to continue.";
  if (picked.includes(OTHER) && !(s.other[q.id] ?? "").trim()) return "Tell us your other answer.";
  if (q.type === "multi" && q.maxSelect && picked.length > q.maxSelect) return `Choose up to ${q.maxSelect}.`;
  return "";
}

/** The payload Ops expects: empty answers dropped, text trimmed, Other text only when Other is picked. */
export function toSubmission(def: SurveyDefinition, s: SurveyAnswers) {
  const answers: Record<string, string | string[]> = {};
  const other: Record<string, string> = {};
  for (const q of def.questions) {
    const v = s.answers[q.id];
    if (Array.isArray(v) ? v.length === 0 : !v?.trim()) continue;
    answers[q.id] = Array.isArray(v) ? v : v.trim();
    const picked = Array.isArray(v) ? v : [v];
    if (picked.includes(OTHER)) other[q.id] = (s.other[q.id] ?? "").trim();
  }
  return { surveyVersion: def.version, answers, other };
}
