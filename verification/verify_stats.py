import asyncio
from playwright.async_api import async_playwright
import time
import os

async def verify_stats():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Serve the current directory
        os.system("python3 -m http.server 8000 > /dev/null 2>&1 &")
        time.sleep(2) # Wait for server to start

        page = await browser.new_page()
        await page.goto("http://localhost:8000/index.html")

        # Fill in data
        await page.fill("#user-name", "Bolt Test")
        await page.fill("#user-dob", "1990-01-01")
        await page.click("#save-user-btn")

        # Execute scan
        await page.click("#generate-btn")

        # Wait for results
        await page.wait_for_selector("#results-section:not(.hidden)", timeout=10000)

        # Check if live counters are present and updating
        seconds_el = page.locator("#val-seconds")
        val1 = await seconds_el.text_content()
        print(f"Seconds initial: {val1}")

        await asyncio.sleep(2)

        val2 = await seconds_el.text_content()
        print(f"Seconds after 2s: {val2}")

        if val1 != val2:
            print("SUCCESS: Live counters are updating.")
        else:
            print("FAILURE: Live counters are NOT updating.")
            exit(1)

        # Check for some other values
        heartbeats_el = page.locator("#est-heart")
        heart_val = await heartbeats_el.text_content()
        print(f"Heartbeats: {heart_val}")

        if "-" in heart_val:
            print("FAILURE: Heartbeats not calculated.")
            exit(1)

        await browser.close()
        os.system("pkill -f 'python3 -m http.server 8000'")

if __name__ == "__main__":
    asyncio.run(verify_stats())
