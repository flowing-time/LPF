# Library Pass Finder (LPF) 🌲

**Library Pass Finder** is a web application designed to help users in the South Bay Area find available **California State Library Parks Passes** and **Santa Clara County Park Passes** at their local libraries.

Instead of checking individual library websites, LPF aggregates availability data from multiple library systems (San José Public Library, Santa Clara County Library District, Santa Clara City Library, and Mountain View Public Library) onto a single, easy-to-use interactive map.

## Features

- **Interactive Map**: Visualize library locations and pass availability status instantly.
- **Pass Flipping**: Toggle between "CA State Pass" and "County Pass" views to see relevant availability.
- **Live Status**: Real-time availability checks (where supported) or direct status indicators.
- ** Unified Interface**: One place to search across different library systems.

## Supported Library Systems

- **SJPL**: San José Public Library
- **SCCLD**: Santa Clara County Library District
- **Santa Clara City Library**
- **Mountain View Public Library** (via Custom Scraper)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Maps**: React Leaflet / OpenStreetMap
- **Styling**: Tailwind CSS
- **Data Fetching**: Custom API Routes & Puppeteer Scrapers

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
