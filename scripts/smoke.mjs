import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });
page.on('console', message => console.log('BROWSER', message.type(), message.text()));
page.on('pageerror', error => console.log('PAGEERROR', error.message));
const results = [];
const check = (name, value) => { if (!value) throw new Error(name); results.push(name); };

await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
check('card rendered', await page.locator('.product-card').count() === 1);
check('six metrics', await page.locator('.metric').count() === 6);

await page.locator('.context-bar button').click();
check('context modal', await page.locator('.modal').count() === 1);
await page.locator('.modal .icon-button').click();

await page.locator('.diagnostic-toggle').click();
check('eight diagnostics', await page.locator('.diagnostic-row').count() === 8);

await page.locator('.chart-expand').click();
check('fullscreen chart', await page.locator('.fullscreen-chart').count() === 1);
await page.locator('.fullscreen-chart__close').click();

await page.locator('.tco-assumptions button').click();
check('tco inputs', await page.locator('.tco-fields input').count() === 2);

await page.locator('.purchase-card .button--dark').click();
check('add modal', await page.locator('.modal').count() === 1);
await page.locator('.modal input[type="number"]').fill('2');
await page.locator('.modal textarea').fill('Контур отопления');
await page.locator('.modal__footer .button--dark').click();
check('spec drawer opens', await page.locator('.spec-drawer').count() === 1);
check('context persisted per item', await page.locator('.spec-context').count() === 1);

const xlsxDownload = page.waitForEvent('download');
await page.locator('.export-actions button').nth(1).click();
const xlsx = await xlsxDownload;
check('xlsx download', xlsx.suggestedFilename().endsWith('.xlsx'));

await page.locator('.spec-drawer .icon-button').click();
await page.locator('.purchase-card .button--outline').click();
check('quote form', await page.locator('.quote-form').count() === 1);
check('inn hidden without company', await page.locator('input[name="inn"]').count() === 0);
await page.locator('input[name="name"]').fill('Тест');
await page.locator('input[name="phone"]').fill('+7 999 000-00-00');
await page.locator('input[name="company"]').fill('APGS Test');
await page.locator('.quote-form button[type="submit"]').click();
await page.waitForTimeout(800);
check('quote placeholder success', await page.locator('.success-state').count() === 1);

console.log(JSON.stringify(results, null, 2));
await browser.close();
