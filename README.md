# Coffee Sales Dashboard

A responsive analytics dashboard built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, following atomic design principles. It displays sales data (mocked via CSV) for 2022, 2023, and 2024, with filterable charts and a clean UI.

---

## Tech Stack

- **Next.js 15** (App Router + TypeScript)
- **Tailwind CSS**
- **Recharts** (Bar, Pie charts)
- **PapaParse** (CSV parsing)
- **Vercel** (Deployment)

---

## Project Structure (Atomic Design)

```
src/
├── app/
│   └── page.tsx               # Main dashboard route (/)
├── components/
│   ├── atoms/                 # Basic UI elements (dropdowns, inputs)
│   ├── molecules/             # Chart legends, tooltips
│   └── organisms/             # Full charts
├── lib/                       # CSV loading logic
├── types/                     # TypeScript interfaces
public/
├── sales.csv                  # Mock sales data
├── coffee-banner.jpg          # Banner image
```

---

## Features

- ✅ Monthly sales bar chart
- ✅ Filter by Year, Product, Payment Type
- ✅ Input threshold to show a sales goal line
- ✅ Responsive layout
- ✅ Built with atomic component design

---

## Data Handling

- Located in `public/sales.csv`
- Parsed client-side using `papaparse`

---

## Getting Started

```bash
# Install dependencies
npm install

# Install required libraries
npm install recharts papaparse

# Start development server
npm run dev
```

Then open:

```
http://localhost:3000
```

---



