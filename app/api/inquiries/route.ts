import { NextResponse } from "next/server";
import { inquirySchema, fieldErrors } from "@/lib/schema";
import { saveInquiry, countByType } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  try {
    const record = await saveInquiry(parsed.data);
    return NextResponse.json({ ok: true, id: record.id, type: record.data.type, createdAt: record.createdAt });
  } catch (err) {
    console.warn("[inquiries] failed to persist", err);
    return NextResponse.json({ ok: false, error: "Could not save your request. Please retry." }, { status: 500 });
  }
}

/** Aggregate counts only — never returns personal data. */
export async function GET() {
  const counts = await countByType();
  return NextResponse.json({ ok: true, counts });
}
