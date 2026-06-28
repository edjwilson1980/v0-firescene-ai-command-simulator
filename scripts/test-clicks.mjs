import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' })

const results = []

async function testClick(name, selector, assert) {
  try {
    const el = page.locator(selector).first()
    await el.waitFor({ state: 'visible', timeout: 5000 })
    await el.click({ timeout: 5000 })
    await page.waitForTimeout(300)
    const ok = await assert()
    results.push({ name, ok, error: ok ? null : 'assertion failed' })
  } catch (e) {
    results.push({ name, ok: false, error: String(e) })
  }
}

await testClick('Dark/Light toggle', 'button:has-text("Light")', async () => {
  return page.locator('button.bg-accent:has-text("Light")').count() > 0
})

await testClick('Map Satellite', 'button:has-text("Satellite")', async () => {
  return page.locator('button.bg-accent:has-text("Satellite")').count() > 0
})

await testClick('Sector Floor toggle', 'button:has-text("Floor")', async () => {
  return page.locator('button:has-text("Basement")').count() > 0
})

await testClick('Bravo Side', 'button:has-text("Bravo Side")', async () => {
  const text = await page.locator('text=Viewing:').locator('..').textContent()
  return text?.includes('Bravo') ?? false
})

await testClick('PAR Check', 'button:has-text("PAR Check")', async () => {
  return page.locator('text=PAR Check - Units On Scene').count() > 0
})

await testClick('Voice Note', 'button:has-text("Voice Note")', async () => {
  return page.locator('text=Voice Note Recorder').count() > 0
})

console.log(JSON.stringify({ errors, results }, null, 2))
await browser.close()
