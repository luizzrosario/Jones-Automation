const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

// Defining folders for screenshots
const screenshotsDir = path.resolve(__dirname, "screenshots");
const errorsDir = path.resolve(__dirname, "ERRORS");

if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);
if (!fs.existsSync(errorsDir)) fs.mkdirSync(errorsDir);

// Simple screenshot function
async function takeScreenshot(page, prefix = "screenshot", isError = false) {
  const now = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
  const filename = `${prefix}_${now}.png`;
  const folder = isError ? errorsDir : screenshotsDir;
  const filePath = path.join(folder, filename);

  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Screenshot saved: ${filePath}`);
}

// Open browser and new page
async function launchBrowser(headlessOption) {
  const browser = await puppeteer.launch({ headless: headlessOption });
  const page = await browser.newPage();
  return { browser, page };
}

// Fill the form with given data
async function fillForm(page, data) {
  await page.type('input[name="name"]', data.name);
  await page.type('input[name="email"]', data.email);
  await page.type('input[name="phone"]', data.phone);
  await page.type('input[name="company"]', data.company);
  await page.select('select[name="number_of_employees"]', data.employees);
}

// Click a button
async function clickButton(page, selector) {
  await page.click(selector);
}

// Wait for "Thank You" page or timeout after 20 seconds
async function waitForThankYou(page, timeout = 20000) {
  try {
    await page.waitForNavigation({ waitUntil: ["domcontentloaded", "networkidle0"], timeout });
    if (page.url().toLowerCase().includes("thank")) {
      console.log("Thank You page reached");
      return true;
    }
  } catch {
    // ignored
  }

  console.log("Form submission failed or timed out");
  await takeScreenshot(page, "ERROR", true);
  return false;
}

// Main automation
async function runFormAutomation(testData) {
  const { browser, page } = await launchBrowser(true); // Here we change browser to headless

  try {
    await page.goto("https://testsite.getjones.com/ExampleForm/", { waitUntil: "domcontentloaded" });
    await fillForm(page, testData);
    await takeScreenshot(page, "FormFilled");
    await clickButton(page, "button.primary.button");
    await waitForThankYou(page);
  } catch (err) {
    console.error("Automation error:", err); 
    await takeScreenshot(page, "CRASH", true);
  } finally {
    await browser.close();
  }
}

module.exports = { runFormAutomation };
