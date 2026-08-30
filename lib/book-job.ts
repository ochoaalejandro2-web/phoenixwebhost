export type BookJobInput = {
  name: string;
  phone: string;
  day: string;
  note: string;
};

export function parseBookJob(input: Partial<BookJobInput>): BookJobInput | null {
  const name = String(input.name || "").trim().slice(0, 120);
  const phone = String(input.phone || "").trim().slice(0, 40);
  const day = String(input.day || "").trim().slice(0, 40);
  const note = String(input.note || "").trim().slice(0, 800);
  if (!name || !phone || !day) return null;
  if (!/\d/.test(phone)) return null;
  return { name, phone, day, note };
}

export function bookJobMessage(job: BookJobInput) {
  return [`Requested day: ${job.day}`, job.note ? `Job: ${job.note}` : ""]
    .filter(Boolean)
    .join("\n");
}
