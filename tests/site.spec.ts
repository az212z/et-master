import { test, expect } from "@playwright/test";

test.describe("ET MASTER site", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html");
  });

  test("loads with RTL + Arabic title", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page).toHaveTitle(/إت ماستر/);
  });

  test("preloader hides", async ({ page }) => {
    await page.waitForTimeout(1600);
    await expect(page.locator("#preloader")).toBeHidden();
  });

  test("hero headline + CTAs visible", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("إت ماستر");
    await expect(page.getByRole("link", { name: "احجز طاولة" }).first()).toBeVisible();
  });

  test("real Google rating cited", async ({ page }) => {
    await expect(page.locator(".trust")).toContainText("خرائط قوقل");
    await expect(page.locator(".trust")).toContainText("595");
  });

  test("no invented prices — uses حسب القائمة", async ({ page }) => {
    const notes = page.locator(".price-note");
    await expect(notes.first()).toContainText("حسب القائمة");
    await expect(notes).toHaveCount(6);
  });

  test("all images resolve (no broken)", async ({ page }) => {
    const imgs = page.locator("main img");
    const n = await imgs.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await imgs.nth(i).scrollIntoViewIfNeeded(); // trigger lazy load
      await expect
        .poll(async () => imgs.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth), {
          timeout: 4000,
          message: `image ${i} should load`,
        })
        .toBeGreaterThan(0);
    }
  });

  test("mobile menu opens full-screen with visible close", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#burger").click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(380);
    await expect(page.locator("#menu-close")).toBeVisible();
    await page.locator("#menu-close").click();
    await expect(menu).toBeHidden();
  });

  test("no horizontal scroll at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("reservation form validates and prepares WhatsApp", async ({ page }) => {
    await page.locator("#r-name").fill("سعود");
    await page.locator("#r-phone").fill("0501234567");
    const popupPromise = page.waitForEvent("popup");
    await page.locator(".submit-btn").click();
    await expect(page.locator("#toast")).toBeVisible();
    const popup = await popupPromise;
    // wa.me may redirect to api.whatsapp.com — assert phone + prefilled message instead
    expect(popup.url()).toContain("966502225533");
    // wa.me may encode spaces as + and redirect — normalize before asserting
    const decoded = decodeURIComponent(popup.url()).replace(/\+/g, " ");
    expect(decoded).toContain("أبغى أحجز طاولة");
    const stored = await page.evaluate(() => localStorage.getItem("etmaster_reservations"));
    expect(stored).toContain("سعود");
  });

  test("floating FABs present", async ({ page }) => {
    await expect(page.locator(".fab-wa")).toHaveAttribute("href", /wa\.me\/966502225533/);
    await expect(page.locator(".fab-call")).toHaveAttribute("href", /0502225533/);
    await expect(page.locator(".fab-map")).toBeVisible();
  });

  test("lightbox opens on gallery click", async ({ page }) => {
    await page.locator(".gal-item").first().click();
    await expect(page.locator("#lightbox")).toBeVisible();
    await page.locator(".lb-close").click();
    await expect(page.locator("#lightbox")).toBeHidden();
  });

  test("JSON-LD Restaurant with rating", async ({ page }) => {
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toContain('"@type": "Restaurant"');
    expect(ld).toContain('"ratingValue": "4.3"');
    expect(ld).toContain("Steak");
  });
});
