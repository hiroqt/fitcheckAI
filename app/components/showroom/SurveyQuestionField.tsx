"use client";

/**
 * One survey step, rendered from the Ops definition (single → select, multi → checkboxes,
 * rating → select with end labels, text/name/email → input). Styling matches the original survey.
 */
import { OTHER, type SurveyAnswers, type SurveyQuestion } from "@/lib/surveyDefinition";

const FIELD = "min-h-11 w-full border border-[#a3acd2] bg-white px-3 text-[#101b43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]";

type Props = { question: SurveyQuestion; value: SurveyAnswers; onChange: (next: SurveyAnswers) => void };

export function SurveyQuestionField({ question: q, value, onChange }: Props) {
  const current = value.answers[q.id];
  const set = (v: string | string[]) => {
    const picked = Array.isArray(v) ? v : [v];
    const other = { ...value.other };
    if (!picked.includes(OTHER)) delete other[q.id];
    onChange({ answers: { ...value.answers, [q.id]: v }, other });
  };
  const help = q.help ? <span className="mt-1 block text-xs font-normal text-[#51516c]">{q.help}</span> : null;
  const choices = [...(q.choices ?? []), ...(q.other ? [{ id: OTHER, label: "Other" }] : [])];
  const otherPicked = (Array.isArray(current) ? current : [current]).includes(OTHER);
  const otherField = q.other && otherPicked ? (
    <label className="block text-sm font-semibold">Please tell us more
      <input value={value.other[q.id] ?? ""} onChange={(e) => onChange({ ...value, other: { ...value.other, [q.id]: e.currentTarget.value } })} required maxLength={300} className={`mt-1 ${FIELD}`} />
    </label>
  ) : null;

  switch (q.type) {
    case "single":
      return <>
        <label className="block text-sm font-semibold">{q.label}{help}
          <select value={typeof current === "string" ? current : ""} onChange={(e) => set(e.currentTarget.value)} required={q.required} className={`mt-1 ${FIELD}`}>
            <option value="" disabled={q.required}>{q.required ? "Choose an answer" : "No answer"}</option>
            {choices.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
        {otherField}
      </>;
    case "multi": {
      const picked = Array.isArray(current) ? current : [];
      const atMax = q.maxSelect !== undefined && picked.length >= q.maxSelect;
      return <>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">{q.label}{q.maxSelect ? <span className="ml-1 font-normal text-[#51516c]">(choose up to {q.maxSelect})</span> : null}{help}</legend>
          {choices.map((c) => {
            const checked = picked.includes(c.id);
            return (
              <label key={c.id} className="flex min-h-11 items-center gap-3 border border-[#a3acd2] bg-white px-3 text-sm text-[#101b43]">
                <input type="checkbox" checked={checked} disabled={!checked && atMax} onChange={() => set(checked ? picked.filter((x) => x !== c.id) : [...picked, c.id])} className="size-4 accent-[#0038ff]" />
                {c.label}
              </label>
            );
          })}
        </fieldset>
        {otherField}
      </>;
    }
    case "rating": {
      const min = q.min ?? 1;
      const max = q.max ?? 5;
      const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      return (
        <label className="block text-sm font-semibold">{q.label}{help}
          <select value={typeof current === "string" ? current : ""} onChange={(e) => set(e.currentTarget.value)} required={q.required} className={`mt-1 ${FIELD}`}>
            <option value="" disabled={q.required}>Choose a rating</option>
            {options.map((n) => (
              <option key={n} value={String(n)}>{n === min && q.minLabel ? `${n} — ${q.minLabel}` : n === max && q.maxLabel ? `${n} — ${q.maxLabel}` : String(n)}</option>
            ))}
          </select>
        </label>
      );
    }
    default:
      return (
        <label className="block text-sm font-semibold">{q.label}{help}
          <input
            type={q.type === "email" ? "email" : "text"}
            autoComplete={q.type === "name" ? "name" : q.type === "email" ? "email" : "off"}
            value={typeof current === "string" ? current : ""}
            onChange={(e) => set(e.currentTarget.value)}
            required={q.required}
            maxLength={q.type === "email" ? 254 : q.type === "name" ? 120 : 300}
            className={`mt-1 ${FIELD}`}
          />
        </label>
      );
  }
}
