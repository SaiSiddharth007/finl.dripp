"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Building2, Check, LineChart, Loader2, Send, Users } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { fieldErrors, inquirySchema, type InquiryType } from "@/lib/schema";
import { LiquidFlora } from "../motifs/Motifs";

const TABS: { id: InquiryType; label: string; icon: typeof Users; blurb: string }[] = [
  { id: "waitlist", label: "Early Access Waitlist", icon: Users, blurb: "Be first in line for Collection 01 and a free volumetric scan." },
  { id: "msme", label: "MSME Maker Partner", icon: Building2, blurb: "Receive digital cutting files and on-demand orders for your unit." },
  { id: "investor", label: "Investor / Incubator Deck", icon: LineChart, blurb: "Request our deck, traction data and on-chain impact ledger." },
];

type Values = Record<string, string>;
const EMPTY: Values = { name: "", email: "", city: "", company: "", capacity: "", organization: "", stage: "", message: "" };

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/60">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            id={`${id}-error`}
            className="mt-1.5 text-xs text-clay"
            data-testid={`error-${id.replace("inq-", "")}`}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-ivory/15 bg-ivory/[0.04] px-4 py-3 text-[15px] text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-sage focus:bg-ivory/[0.07]";

export default function Footer() {
  const [tab, setTab] = useState<InquiryType>("waitlist");
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [ref, setRef] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const payload = () => {
    const base = { type: tab, name: values.name, email: values.email, message: values.message };
    if (tab === "waitlist") return { ...base, city: values.city };
    if (tab === "msme") return { ...base, company: values.company, capacity: values.capacity || undefined };
    return { ...base, organization: values.organization, stage: values.stage || undefined };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = payload();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as { ok: boolean; id?: string; error?: string; fields?: Record<string, string> };
      if (!res.ok || !json.ok) {
        if (json.fields) setErrors(json.fields);
        setServerMsg(json.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setRef(json.id?.slice(0, 8).toUpperCase() ?? "");
      setStatus("success");
    } catch {
      setServerMsg("Network error — please check your connection and retry.");
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setStatus("idle");
    setErrors({});
  };

  const err = (k: string) => errors[k] || undefined;
  const aria = (k: string) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `inq-${k}-error` : undefined });

  return (
    <footer id="join" className="relative overflow-hidden bg-forest text-ivory" data-testid="section-footer">
      <LiquidFlora opacity={0.12} />
      <div className="container-edge relative py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sage">10 — Join</p>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.03em]" data-testid="footer-headline">
              Join the movement toward <span className="text-sage">organic precision.</span>
            </h2>
            <p className="mt-6 max-w-md text-ivory/65">{TABS.find((t) => t.id === tab)?.blurb}</p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[32px] border border-ivory/10 bg-ivory/[0.03] p-5 backdrop-blur-sm sm:p-8">
              <div role="tablist" aria-label="Inquiry type" className="grid gap-2 sm:grid-cols-3">
                {TABS.map((t) => {
                  const on = t.id === tab;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      data-testid={`inq-tab-${t.id}`}
                      onClick={() => {
                        setTab(t.id);
                        setErrors({});
                        if (status !== "submitting") setStatus("idle");
                      }}
                      className={`relative flex items-center gap-2 rounded-full px-4 py-3 text-left text-[13px] font-semibold transition-colors ${
                        on ? "text-forest" : "text-ivory/65 hover:text-ivory"
                      }`}
                    >
                      {on && <motion.span layoutId="inq-tab" className="absolute inset-0 rounded-full bg-sage" />}
                      <t.icon className="relative h-4 w-4 shrink-0" />
                      <span className="relative">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="status"
                    data-testid="inq-success"
                    className="flex flex-col items-start gap-4 py-12"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage text-forest">
                      <Check className="h-6 w-6" />
                    </span>
                    <p className="font-display text-3xl font-bold">You&apos;re in, {values.name.split(" ")[0]}.</p>
                    <p className="text-ivory/65">
                      Your {TABS.find((t) => t.id === tab)?.label.toLowerCase()} request is logged
                      {ref && (
                        <>
                          {" "}
                          · ref <span className="font-mono text-sage" data-testid="inq-ref">{ref}</span>
                        </>
                      )}
                      . We&apos;ll reach out at {values.email.trim().toLowerCase()} within 48 hours.
                    </p>
                    <button type="button" onClick={reset} className="btn-ghost border-ivory/20 text-ivory hover:bg-ivory/5">
                      Submit another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key={`form-${tab}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onSubmit={onSubmit}
                    noValidate
                    className="mt-6 grid gap-4 sm:grid-cols-2"
                    data-testid="inq-form"
                  >
                    <Field id="inq-name" label="Full name" error={err("name")}>
                      <input id="inq-name" className={inputCls} value={values.name} onChange={set("name")} autoComplete="name" placeholder="Aarav Krishnan" {...aria("name")} />
                    </Field>
                    <Field id="inq-email" label="Email" error={err("email")}>
                      <input id="inq-email" type="email" className={inputCls} value={values.email} onChange={set("email")} autoComplete="email" placeholder="you@domain.com" {...aria("email")} />
                    </Field>

                    {tab === "waitlist" && (
                      <Field id="inq-city" label="City" error={err("city")}>
                        <input id="inq-city" className={inputCls} value={values.city} onChange={set("city")} autoComplete="address-level2" placeholder="Bengaluru" {...aria("city")} />
                      </Field>
                    )}
                    {tab === "msme" && (
                      <>
                        <Field id="inq-company" label="Unit / company" error={err("company")}>
                          <input id="inq-company" className={inputCls} value={values.company} onChange={set("company")} placeholder="Sri Murugan Knits" {...aria("company")} />
                        </Field>
                        <Field id="inq-capacity" label="Monthly capacity (pcs)" error={err("capacity")}>
                          <select id="inq-capacity" className={inputCls} value={values.capacity} onChange={set("capacity")} {...aria("capacity")}>
                            <option value="">Select…</option>
                            <option value="<500">Under 500</option>
                            <option value="500-2000">500 – 2,000</option>
                            <option value="2000-10000">2,000 – 10,000</option>
                            <option value="10000+">10,000+</option>
                          </select>
                        </Field>
                      </>
                    )}
                    {tab === "investor" && (
                      <>
                        <Field id="inq-organization" label="Fund / incubator" error={err("organization")}>
                          <input id="inq-organization" className={inputCls} value={values.organization} onChange={set("organization")} placeholder="Incubation cell, angel network…" {...aria("organization")} />
                        </Field>
                        <Field id="inq-stage" label="Programme / stage" error={err("stage")}>
                          <select id="inq-stage" className={inputCls} value={values.stage} onChange={set("stage")} {...aria("stage")}>
                            <option value="">Select…</option>
                            <option value="angel">Angel</option>
                            <option value="pre-seed">Pre-seed</option>
                            <option value="seed">Seed</option>
                            <option value="incubator">Incubator / accelerator</option>
                            <option value="grant">Grant / government scheme</option>
                          </select>
                        </Field>
                      </>
                    )}
                    <div className={tab === "waitlist" ? "" : "sm:col-span-2"}>
                      <Field id="inq-message" label="Note (optional)" error={err("message")}>
                        <input id="inq-message" className={inputCls} value={values.message} onChange={set("message")} placeholder="Anything we should know?" {...aria("message")} />
                      </Field>
                    </div>

                    <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-ivory/40">We only use your details to respond to this request.</p>
                      <button type="submit" disabled={status === "submitting"} data-testid="inq-submit" className="btn-primary disabled:opacity-70">
                        {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {status === "submitting" ? "Sending…" : "Submit Request"}
                      </button>
                    </div>
                    {status === "error" && (
                      <p role="alert" className="text-sm text-clay sm:col-span-2" data-testid="inq-error">
                        {serverMsg}
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-10 border-t border-ivory/10 pt-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="font-display text-[clamp(3.5rem,13vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-ivory/95">DRIPMINT</p>
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-ivory/60">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex items-center gap-1 hover:text-ivory">
                    {l.label} <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/40">
              <p>IIT Tirupati · Tirupur, India</p>
              <p className="mt-2">© {2026} Dripmint AI</p>
              <p className="mt-2">AI-to-MSME Protocol v3</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
