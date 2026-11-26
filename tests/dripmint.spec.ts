import { test as base, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/* ------------------------------------------------------------------ */
/*  Fixture: every test fails if the page logs console.error or throws */
/* ------------------------------------------------------------------ */
const test = base.extend<{ issues: string[] }>({
  issues: [
    async ({ page }, use) => {
      const issues: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") issues.push(`console.error: ${msg.text()}`);
      });
      page.on("pageerror", (err) => issues.push(`pageerror: ${err.message}`));
      await use(issues);
      expect(issues, `Console / page errors:\n${issues.join("\n")}`).toEqual([]);
    },
    { auto: true },
  ],
});

const SHOTS = path.join(process.cwd(), "verification-screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" as ScrollBehavior });
    await new Promise((r) => setTimeout(r, 300));
  });
  // allow reveal transitions (0.8s) to finish
  await page.waitForTimeout(1000);
}

async function noHorizontalOverflow(page: Page) {
  const r = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    offenders: Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0) return false;
        // only report elements not clipped by an overflow ancestor
        let p = el.parentElement;
        while (p && p !== document.body) {
          const s = getComputedStyle(p);
          if (s.overflowX !== "visible") return false;
          p = p.parentElement;
        }
        return b.right > window.innerWidth + 1 || b.left < -1;
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`),
  }));
  expect(r.scrollWidth, `Horizontal overflow; offenders: ${r.offenders.join(" | ")}`).toBeLessThanOrEqual(r.innerWidth);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("site-nav")).toBeVisible();
});

/* ------------------------------------------------------------------ */
test("all sections render with text and valid SVG graphics", async ({ page }) => {
  const sections = [
    "section-hero",
    "section-crisis",
    "section-flow",
    "section-studio",
    "section-lyocell",
    "section-impact",
    "section-circular",
    "section-wardrobe",
    "section-lore",
    "section-footer",
  ];
  for (const id of sections) {
    const s = page.getByTestId(id);
    await s.scrollIntoViewIfNeeded();
    await expect(s, id).toBeVisible();
    const text = (await s.innerText()).trim();
    expect(text.length, `${id} has text`).toBeGreaterThan(40);
    const svgs = s.locator("svg");
    expect(await svgs.count(), `${id} contains svg`).toBeGreaterThan(0);
    const box = await svgs.first().boundingBox();
    expect(box && box.width > 0 && box.height > 0, `${id} svg has size`).toBeTruthy();
  }

  // copy from the brief
  await expect(page.getByText("Designed to Refresh.")).toBeVisible();
  await expect(page.getByTestId("editorial-headline")).toContainText("Fashion That Fits You. And the Planet.");
  await expect(page.getByText("92 Million Tons")).toBeVisible();
  await expect(page.getByText("On-Demand. Perfect Sizing. Pure Botanic Fiber.")).toBeVisible();
  await expect(page.getByTestId("lore-header")).toHaveText("THE LORE: SOURCE CODE & SUSTAINABILITY");
  await expect(page.getByTestId("footer-headline")).toContainText("Join the movement toward organic precision.");

  // all four procedural motifs are present
  for (const code of ["P_01", "P_02", "P_03", "P_04"]) {
    expect(await page.locator(`svg[data-motif="${code}"]`).count(), code).toBeGreaterThan(0);
  }

  // no broken images anywhere
  const broken = await page.evaluate(() => Array.from(document.images).filter((i) => !i.complete || i.naturalWidth === 0).length);
  expect(broken).toBe(0);

  // animated counters reach their targets
  await page.getByTestId("counter-garments").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("counter-garments")).toHaveText("10,240+", { timeout: 6000 });
  await expect(page.getByTestId("counter-water")).toHaveText("14.2M+");
  await expect(page.getByTestId("counter-fit")).toHaveText("98.4%");
});

/* ------------------------------------------------------------------ */
test("customization studio updates preview and impact metrics", async ({ page }) => {
  const studio = page.getByTestId("section-studio");
  await studio.scrollIntoViewIfNeeded();
  const preview = studio.getByTestId("garment-preview").first();

  // defaults from the brief
  await expect(preview).toHaveAttribute("data-garment", "sage-shell-v3");
  await expect(page.getByTestId("metric-water")).toHaveText("19,990L");
  await expect(page.getByTestId("metric-co2")).toContainText("99%");
  await expect(page.getByTestId("metric-node")).toHaveText("Tirupur Cluster #04");
  await expect(page.getByTestId("metric-cutfile")).toHaveText("DM-SSV3-7D946F-RLX-F");

  // switch garment
  await page.getByTestId("studio-garment-liquid-drape-tunic").click();
  await expect(preview).toHaveAttribute("data-garment", "liquid-drape-tunic");
  await expect(page.getByTestId("studio-garment-name")).toHaveText("Liquid Drape Tunic");
  await expect(page.getByTestId("metric-water")).toHaveText("14,393L");
  await expect(page.getByTestId("metric-node")).toHaveText("Tirupur Cluster #02");

  // switch dye — preview fill + cutting file + dye liquor update
  const liquorBefore = await page.getByTestId("metric-dye-liquor").innerText();
  await page.getByTestId("studio-dye-mineral-clay").click();
  await expect(preview).toHaveAttribute("data-dye", "mineral-clay");
  await expect(preview).toHaveAttribute("data-fill", "#B88B72");
  await expect(page.getByTestId("studio-dye-name")).toHaveText("Mineral Clay");
  await expect(page.getByTestId("metric-cutfile")).toContainText("B88B72");
  await expect(page.getByTestId("metric-dye-liquor")).not.toHaveText(liquorBefore);
  // the rendered SVG body really is clay coloured after the morph
  await expect
    .poll(async () => (await preview.getByTestId("garment-body").getAttribute("fill"))?.toLowerCase().replace(/\s/g, ""), { timeout: 3000 })
    .toMatch(/#b88b72|rgba?\(184,139,114/);

  // fit + length
  const bodyBefore = await preview.getByTestId("garment-body").getAttribute("d");
  await page.getByTestId("studio-fit-boxy").click();
  await expect(preview).toHaveAttribute("data-fit", "boxy");
  await expect(page.getByTestId("metric-cutfile")).toHaveText("DM-LDT1-B88B72-BXY-F");
  await page.getByTestId("studio-length-cropped").click();
  await expect(preview).toHaveAttribute("data-length", "cropped");
  await expect(page.getByTestId("metric-cutfile")).toHaveText("DM-LDT1-B88B72-BXY-C");
  await expect.poll(() => preview.getByTestId("garment-body").getAttribute("d")).not.toBe(bodyBefore);

  // cargo trouser
  await page.getByTestId("studio-garment-architectural-cargo").click();
  await expect(page.getByTestId("metric-node")).toHaveText("Tirupur Cluster #07");

  // save & remix to social wardrobe
  await page.getByTestId("studio-save").click();
  await expect(page.getByTestId("studio-toast")).toContainText("saved to your Social Wardrobe");
  const mine = page.getByTestId("wardrobe-card-mine");
  await expect(mine).toHaveCount(1);
  await expect(mine.getByTestId("garment-preview")).toHaveAttribute("data-garment", "architectural-cargo");
});

/* ------------------------------------------------------------------ */
test("social wardrobe 'Remix This Fit' loads configuration into studio", async ({ page }) => {
  const feed = page.getByTestId("wardrobe-feed");
  await feed.scrollIntoViewIfNeeded();
  await expect(feed.getByTestId("wardrobe-card")).toHaveCount(4);

  await page.getByTestId("remix-cd-02").click();
  const preview = page.getByTestId("section-studio").getByTestId("garment-preview").first();
  await expect(preview).toHaveAttribute("data-garment", "liquid-drape-tunic");
  await expect(preview).toHaveAttribute("data-dye", "mineral-clay");
  await expect(preview).toHaveAttribute("data-fit", "relaxed");
  await expect(page.getByTestId("studio-remix-source")).toContainText("Terracotta Flow by @rahulweaves");
  await expect(page.getByTestId("section-studio")).toBeInViewport({ ratio: 0.1, timeout: 5000 });

  await page.getByTestId("wardrobe-feed").scrollIntoViewIfNeeded();
  await page.getByTestId("remix-cd-03").click();
  await expect(preview).toHaveAttribute("data-garment", "architectural-cargo");
  await expect(preview).toHaveAttribute("data-dye", "raw-ivory");
  await expect(preview).toHaveAttribute("data-fit", "tailored");
  await expect(preview).toHaveAttribute("data-length", "cropped");
  await expect(page.getByTestId("metric-cutfile")).toHaveText("DM-ACT2-F4F1E6-TLR-C");
});

/* ------------------------------------------------------------------ */
test("circular exchange calculator recalculates refresh credits", async ({ page }) => {
  const calc = page.getByTestId("circ-calculator");
  await calc.scrollIntoViewIfNeeded();

  // Cycle 1, Sage Shell (₹6,400): 20%
  await expect(page.getByTestId("circ-credit-pct")).toHaveText("20%");
  await expect(page.getByTestId("circ-credit-inr")).toHaveText("₹1,280");
  await expect(page.getByTestId("circ-water")).toHaveText("19,990 L");

  // slider → cycle 7: capped at 65%
  await page.getByTestId("circ-cycle").fill("7");
  await expect(page.getByTestId("circ-cycle-label")).toHaveText("Cycle 7");
  await expect(page.getByTestId("circ-credit-pct")).toHaveText("65%");
  await expect(page.getByTestId("circ-credit-inr")).toHaveText("₹4,160");
  await expect(page.getByTestId("circ-water")).toHaveText("139,930 L");
  await expect(page.getByTestId("circ-co2")).toHaveText("94.5 kg");
  await expect(page.getByTestId("circ-stage")).toContainText("Final Return");

  // cycle button → 4, garment → cargo (₹7,200)
  await page.getByTestId("circ-cycle-btn-4").click();
  await page.getByTestId("circ-garment-architectural-cargo").click();
  await expect(page.getByTestId("circ-credit-pct")).toHaveText("42.5%");
  await expect(page.getByTestId("circ-credit-inr")).toHaveText("₹3,060");
  await expect(page.getByTestId("circ-water")).toHaveText("94,353 L");
  await expect(page.getByTestId("circ-cycle")).toHaveValue("4");

  // keyboard on the slider
  await page.getByTestId("circ-cycle").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("circ-credit-pct")).toHaveText("35%");
});

/* ------------------------------------------------------------------ */
test("Start Your Scan modal: full 3-step flow sends measurements to studio", async ({ page }) => {
  await page.getByTestId("hero-scan-cta").click();
  const modal = page.getByTestId("scan-modal");
  await expect(modal).toBeVisible();
  await expect(modal.getByTestId("scan-step-1")).toBeVisible();

  await modal.getByTestId("scan-height").fill("180");
  await modal.getByTestId("scan-calibrate").click();
  await modal.getByTestId("scan-next-1").click({ timeout: 6000 });

  await expect(modal.getByTestId("scan-step-2")).toBeVisible();
  await modal.getByTestId("scan-undertone-warm").click();
  await modal.getByTestId("scan-generate").click();

  await expect(modal.getByTestId("scan-step-3")).toBeVisible({ timeout: 5000 });
  await expect(modal.getByTestId("scan-measurements")).toContainText("Chest");
  await expect(modal.getByTestId("scan-measurements")).toContainText("102.6"); // 180 × 0.57 athletic
  await page.screenshot({ path: path.join(SHOTS, `${test.info().project.name}-modal-scan.png`) });

  await modal.getByTestId("scan-send").click();
  await expect(modal).toBeHidden();
  await expect(page.getByTestId("studio-measurements")).toContainText("Chest 102.6 cm");
  const preview = page.getByTestId("section-studio").getByTestId("garment-preview").first();
  await expect(preview).toHaveAttribute("data-dye", "mineral-clay");
  await expect(preview).toHaveAttribute("data-fit", "boxy");

  // close via button
  await page.getByTestId("nav-scan-cta").click();
  await expect(modal).toBeVisible();
  await expect(modal.getByTestId("scan-step-1")).toBeVisible();
  await modal.getByTestId("scan-modal-close").click();
  await expect(modal).toBeHidden();

  // close via Escape
  await page.getByTestId("nav-scan-cta").click();
  await expect(modal).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});

/* ------------------------------------------------------------------ */
test("Watch Framework Film modal: chapters, playback and closing", async ({ page }) => {
  await page.getByTestId("hero-film-cta").click();
  const modal = page.getByTestId("film-modal");
  await expect(modal).toBeVisible();
  await expect(modal.getByTestId("film-scene-1")).toBeVisible();
  await expect(modal.getByTestId("film-chapter-copy")).toContainText("412K-point cloud");

  await modal.getByTestId("film-toggle").click(); // pause
  await expect(modal.getByTestId("film-toggle")).toHaveAttribute("aria-label", "Play");

  await modal.getByTestId("film-next").click();
  await expect(modal.getByTestId("film-scene-2")).toBeVisible();
  await modal.getByTestId("film-next").click();
  await expect(modal.getByTestId("film-chapter-copy")).toContainText("digital cutting file");
  await modal.getByTestId("film-chapter-4").click();
  await expect(modal.getByTestId("film-scene-4")).toBeVisible();
  await expect(modal.getByTestId("film-chapter-copy")).toContainText("Up to 7 lives");
  await expect(modal.getByTestId("film-next")).toBeDisabled();
  await page.screenshot({ path: path.join(SHOTS, `${test.info().project.name}-modal-film.png`) });

  await modal.getByTestId("film-prev").click();
  await expect(modal.getByTestId("film-scene-3")).toBeVisible();

  await modal.getByTestId("film-modal-close").click();
  await expect(modal).toBeHidden();

  await page.getByTestId("hero-film-cta").click();
  await expect(modal).toBeVisible();
  await expect(modal.getByTestId("film-scene-1")).toBeVisible(); // resets to chapter 1
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
});

test("film autoplay advances chapters on its own", async ({ page }) => {
  await page.getByTestId("hero-film-cta").click();
  const modal = page.getByTestId("film-modal");
  await expect(modal.getByTestId("film-scene-2")).toBeVisible({ timeout: 9000 });
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
});

/* ------------------------------------------------------------------ */
test("footer inquiry form validates and submits to /api/inquiries", async ({ page }) => {
  const footer = page.getByTestId("section-footer");
  await footer.scrollIntoViewIfNeeded();

  // client-side validation blocks empty submission (no request fired)
  let posted = 0;
  page.on("request", (r) => {
    if (r.url().includes("/api/inquiries") && r.method() === "POST") posted++;
  });
  await page.getByTestId("inq-submit").click();
  await expect(page.getByTestId("error-name")).toBeVisible();
  await expect(page.getByTestId("error-email")).toBeVisible();
  await expect(page.getByTestId("error-city")).toBeVisible();
  expect(posted).toBe(0);

  // waitlist submission
  await page.locator("#inq-name").fill("Aarav Krishnan");
  await page.locator("#inq-email").fill("aarav.test@example.com");
  await page.locator("#inq-city").fill("Bengaluru");
  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/inquiries") && r.request().method() === "POST"),
    page.getByTestId("inq-submit").click(),
  ]);
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.ok).toBe(true);
  expect(json.type).toBe("waitlist");
  await expect(page.getByTestId("inq-success")).toContainText("You're in, Aarav.");
  await expect(page.getByTestId("inq-ref")).toHaveText(String(json.id).slice(0, 8).toUpperCase());

  // MSME partner tab
  await page.getByTestId("inq-tab-msme").click();
  await page.locator("#inq-name").fill("Lakshmi Narayanan");
  await page.locator("#inq-email").fill("units@example.com");
  await page.locator("#inq-company").fill("Sri Murugan Knits");
  await page.locator("#inq-capacity").selectOption("2000-10000");
  const [res2] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/inquiries") && r.request().method() === "POST"),
    page.getByTestId("inq-submit").click(),
  ]);
  expect(res2.status()).toBe(200);
  await expect(page.getByTestId("inq-success")).toBeVisible();

  // investor tab
  await page.getByTestId("inq-tab-investor").click();
  await page.locator("#inq-name").fill("Priya Raman");
  await page.locator("#inq-email").fill("deals@example.com");
  await page.locator("#inq-organization").fill("Campus Incubation Cell");
  await page.locator("#inq-stage").selectOption("incubator");
  const [res3] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/inquiries") && r.request().method() === "POST"),
    page.getByTestId("inq-submit").click(),
  ]);
  expect(res3.status()).toBe(200);
  await expect(page.getByTestId("inq-success")).toContainText("Priya");
  await page.getByTestId("inq-success").screenshot({ path: path.join(SHOTS, `${test.info().project.name}-form-success.png`) });
});

test("API rejects invalid payloads server-side", async ({ request }) => {
  const bad = await request.post("/api/inquiries", { data: { type: "waitlist", name: "A", email: "nope" } });
  expect(bad.status()).toBe(422);
  const body = await bad.json();
  expect(body.fields.name).toBeTruthy();
  expect(body.fields.email).toBeTruthy();

  const wrongType = await request.post("/api/inquiries", { data: { type: "spam" } });
  expect(wrongType.status()).toBe(422);

  const notJson = await request.post("/api/inquiries", { headers: { "content-type": "application/json" }, data: Buffer.from("{oops") });
  expect(notJson.status()).toBe(400);

  const counts = await request.get("/api/inquiries");
  expect(counts.status()).toBe(200);
  const c = await counts.json();
  expect(c.ok).toBe(true);
  expect(JSON.stringify(c)).not.toContain("@"); // never leaks emails
});

/* ------------------------------------------------------------------ */
test("responsive audit: no horizontal overflow + screenshots", async ({ page }, info) => {
  await noHorizontalOverflow(page);
  await scrollThrough(page);
  await noHorizontalOverflow(page);

  if (info.project.name === "mobile") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByTestId("nav-menu-toggle").click();
    await expect(page.getByRole("link", { name: /Circular Loop/ }).first()).toBeVisible();
    await noHorizontalOverflow(page);
    await page.screenshot({ path: path.join(SHOTS, "mobile-nav-menu.png") });
    await page.getByTestId("nav-menu-toggle").click();
  }

  // modals must not overflow either
  await page.getByTestId("nav-scan-cta").click();
  await expect(page.getByTestId("scan-modal")).toBeVisible();
  await noHorizontalOverflow(page);
  await page.keyboard.press("Escape");

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SHOTS, `${info.project.name}-hero.png`) });
  await page.screenshot({ path: path.join(SHOTS, `${info.project.name}-full.png`), fullPage: true });

  for (const id of ["section-studio", "section-lyocell", "section-circular", "section-wardrobe", "section-lore", "section-footer"]) {
    await page.getByTestId(id).scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.getByTestId(id).screenshot({ path: path.join(SHOTS, `${info.project.name}-${id.replace("section-", "")}.png`) });
  }
});
