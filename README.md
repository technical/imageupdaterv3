# imageupdaterv3
A scraping utility to pull data from the Lottery's website and update cloudinary variables in order to trigger an image update.

## Problem: Geographic Blocking

The National Lottery website blocks requests from Netlify's US-based servers. The error `ETIMEDOUT` indicates the site is rejecting connections from non-UK IP addresses.

## Solutions

### 1. Manual Update Function (Immediate Solution)
Use the manual update endpoint when the scraper fails:
- Endpoint: `/.netlify/functions/euromillions-manual-update`
- Set these environment variables in Netlify dashboard:
  - `LOTTERY_PRIZE_AMOUNT` - e.g., "145" for £145M
  - `LOTTERY_DRAW_DATE` - e.g., "Friday" or "Tuesday"
  - `LOTTERY_SUPER_DRAW` - "true" or "false"

### 2. Proxy Service (Recommended Long-term)
Sign up for a UK-based proxy service:
- [ScraperAPI](https://www.scraperapi.com) - Has UK proxy support
- [Bright Data](https://brightdata.com) - Premium proxies
- [ProxyCrawl](https://proxycrawl.com) - Web scraping API

### 3. Alternative Data Sources
- Check if the lottery has an RSS feed
- Look for third-party lottery APIs
- Use a UK-based server/function instead of Netlify

## Endpoints

- **Scheduled**: `/.netlify/functions/euromillions-scheduled` (Auto runs Wed/Sat 00:30 UTC)
- **Manual Trigger**: `/.netlify/functions/euromillions-manual` (Attempts direct scrape)
- **Manual Update**: `/.netlify/functions/euromillions-manual-update` (Uses env vars)
- **Direct Image**: `/.netlify/functions/euromillions-image` (Returns PNG image)
