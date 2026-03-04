import asyncio
from playwright.async_api import async_playwright
import time
import os

async def verify_frontend():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Serve the current directory
        os.system("python3 -m http.server 8000 > /dev/null 2>&1 &")
        time.sleep(2) # Wait for server to start

        page = await browser.new_page()
        await page.goto("http://localhost:8000/index.html")

        # Fill in data
        await page.fill("#user-name", "Bolt Optimization Test")
        await page.fill("#user-dob", "1995-05-24")
        await page.click("#save-user-btn")

        # Execute scan
        await page.click("#generate-btn")

        # Wait for results
        await page.wait_for_selector("#results-section:not(.hidden)", timeout=10000)

        # Wait a bit for live updates to kick in
        await asyncio.sleep(2)

        # Take screenshot
        await page.screenshot(path="/home/jules/verification/optimization_result.png", full_page=True)
        print("Screenshot saved to /home/jules/verification/optimization_result.png")

        await browser.close()
        os.system("pkill -f 'python3 -m http.server 8000'")

if __name__ == "__main__":
    asyncio.run(verify_frontend())
