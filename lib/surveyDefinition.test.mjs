import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDefinition, stepProblem, toSubmission } from "./surveyDefinition.ts";

const def = {
  version: 3, title: "Quick questions", intro: "",
  questions: [
    { id: "name", type: "name", label: "Name", required: true },
    { id: "challenge", type: "single", label: "Challenge?", required: true, other: true, choices: [{ id: "fit", label: "Fit" }] },
    { id: "shops", type: "multi", label: "Where?", required: false, maxSelect: 2, choices: [{ id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }] },
  ],
};

test("parseDefinition accepts the Ops shape and rejects junk", () => {
  assert.equal(parseDefinition(def)?.questions.length, 3);
  assert.equal(parseDefinition({ ...def, questions: [] }), undefined);
  assert.equal(parseDefinition({ ...def, questions: [{ id: "x", type: "video", label: "x", required: true }] }), undefined);
  assert.equal(parseDefinition(null), undefined);
});

test("stepProblem enforces required, Other text and multi limits", () => {
  const [, challenge, shops] = parseDefinition(def).questions;
  assert.match(stepProblem(challenge, { answers: {}, other: {} }), /Choose/);
  assert.match(stepProblem(challenge, { answers: { challenge: "other" }, other: {} }), /other/);
  assert.equal(stepProblem(challenge, { answers: { challenge: "other" }, other: { challenge: "Price" } }), "");
  assert.match(stepProblem(shops, { answers: { shops: ["a", "b", "c"] }, other: {} }), /up to 2/);
  assert.equal(stepProblem(shops, { answers: {}, other: {} }), "");
});

test("toSubmission drops empty answers and stray Other text", () => {
  const out = toSubmission(parseDefinition(def), { answers: { name: " Joy ", challenge: "fit", shops: [] }, other: { challenge: "left over" } });
  assert.deepEqual(out, { surveyVersion: 3, answers: { name: "Joy", challenge: "fit" }, other: {} });
});
