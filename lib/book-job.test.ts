import assert from "node:assert/strict";
import test from "node:test";
import { bookJobMessage, parseBookJob } from "./book-job.ts";

test("book a job requires name, phone with a digit, and a day", () => {
  assert.equal(parseBookJob({ name: "Pat", phone: "call me", day: "Tuesday" }), null);
  assert.equal(parseBookJob({ name: "", phone: "4805550100", day: "Tuesday" }), null);
  const job = parseBookJob({
    name: "Pat Ruiz",
    phone: "(480) 555-0100",
    day: "2026-09-04",
    note: "Lawn and drip check",
  });
  assert.ok(job);
  assert.equal(job.name, "Pat Ruiz");
  assert.match(bookJobMessage(job), /2026-09-04/);
  assert.match(bookJobMessage(job), /Lawn and drip check/);
});
