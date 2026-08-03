import { expect, test } from '@playwright/test';

/**
 * The `[hidden]` override trap.
 *
 * The UA stylesheet says `[hidden] { display: none }`, but ANY author rule that
 * sets a display on the same element wins, regardless of specificity — author
 * styles outrank the UA sheet. So a panel that ships with the `hidden`
 * attribute, whose class also carries `display: grid/flex/block`, renders
 * anyway, and every `el.hidden = true` against it is a silent no-op.
 *
 * Found live in rsa-forge (six result regions painted before the learner ran
 * anything), stego-suite (sequencing tips that never retired), and
 * hpke-envelope (a PSK panel visible AND focusable in modes that use no PSK).
 *
 * This probe reports any element carrying the attribute that the browser is
 * still painting.
 */
test('no element with the hidden attribute is actually rendered', async ({ page }) => {
  await page.goto('.');
  await page.waitForTimeout(300);

  const leaks = await page.evaluate(() => {
    const out: { tag: string; cls: string; display: string }[] = [];
    for (const el of Array.from(document.querySelectorAll('[hidden]'))) {
      const cs = getComputedStyle(el as HTMLElement);
      if (cs.display !== 'none') {
        out.push({
          tag: (el as HTMLElement).tagName.toLowerCase(),
          cls: (el as HTMLElement).className?.toString().slice(0, 60) ?? '',
          display: cs.display,
        });
      }
    }
    return out;
  });

  expect(leaks, `elements marked hidden that still render: ${JSON.stringify(leaks)}`).toEqual([]);
});
