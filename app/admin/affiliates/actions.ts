"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { addCloser } from "@/lib/store";

export async function createCloserAction(formData: FormData) {
  await requireOwner();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const code = String(formData.get("code") || "").trim();
  await addCloser({ name, email, code: code || undefined });
  revalidatePath("/admin/affiliates");
  revalidatePath("/admin/leads");
}
