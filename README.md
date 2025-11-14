<div align="center">

  <h1>Customizable Dashboard Template — Sankhya HTML5 (React + Vite)</h1>

  <p>
    The official foundation for building dynamic dashboards in the Sankhya ecosystem,
    featuring drag-and-drop grids, reusable components, and ready-to-use integration with the HTML5 boilerplate.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Typescript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://badges.aleen42.com/src/vitejs.svg" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>

  <p>
    <a href="#quick-start"><img src="https://img.shields.io/badge/Início%20Rápido-Start-blue" alt="Quick Start" /></a>
    <a href="#example-dashboard"><img src="https://img.shields.io/badge/Exemplo-Preview-success" alt="Example Preview" /></a>
    <a href="#license"><img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-black" alt="License: MIT" /></a>
  </p>
</div>

---

## Overview

This repository merges Sankhya's HTML5 boilerplate with an extra UI layer for customizable dashboards.  
You'll find here:

- Customization context (`DashboardCustomizationProvider`) with persistence in `localStorage`;
- `CustomizableGrid` component based on `react-grid-layout` with draggable and resizable items;
- Component library (`Select`, `DataTable`, `KpiCard`, `InfoTooltip`, etc.) styled using Tailwind;
- Full `DashboardLayout` including a `Header` and collapsible `SideBar`;
- An example project in `example/` that loads a JSON and demonstrates the dynamic grid in action.

---

## Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` to view the dashboard using the default boilerplate.

To explore the full layout with static data and interactive grid:

```bash
pnpm example
```

This script starts a Vite dev server inside the `example/` folder and points to `http://localhost:5174` (port displayed in the terminal).

---

## Project Structure

```
.
├─ src/
│  ├─ app/app.tsx                # Default dashboard composition
│  ├─ components/                # UI and layout component library
│  │  ├─ layout/
│  │  │  ├─ dashboard-layout/    # SideBar + Header + main area
│  │  │  └─ customizable-grid/   # Responsive, draggable, and resizable grid
│  │  └─ ui/                     # Buttons, select, cards, data-table, etc.
│  ├─ contexts/                  # DashboardCustomizationProvider
│  ├─ hooks/                     # Reusable hooks (e.g. useFilter)
│  └─ types/                     # Auxiliary declarations (e.g. react-grid-layout)
├─ example/                      # Isolated Vite demo project
│  ├─ src/App.tsx                # Uses components from this template
│  └─ src/data.json              # Sample data source
├─ public/index.jsp              # JSP scaffold for Sankhya
├─ package.json                  # Shared scripts and dependencies
└─ vite.config.ts                # Build with stable output names + auto zip
```

---

## Key Features

- **Live customization**  
  The `Header` includes a "Customize" button that toggles edit mode. The grid becomes draggable and resizable in real-time.

- **Grid-specific persistence**  
  Each grid tracks a `storageKey`. When saved, positions and sizes are persisted by breakpoint.

- **Automatic card height**  
  `ResizeObserver` measures and updates the real content height in the grid layout (without entering edit mode).

- **Responsive components**  
  `Select` with configurable size and smart truncation, flexible paged `DataTable`, and collapsible `SideBar`.

- **Sankhya-ready setup**  
  Build generates `dist/index.jsp`, stable asset names (`assets/app.js`, `assets/index.css`), and the `sankhya-component.zip` bundle.

---

## Available Scripts

- `pnpm dev` — starts the main dashboard on Sankhya's boilerplate.
- `pnpm build` — typecheck + production build + ZIP generation (`dist/sankhya-component.zip`).
- `pnpm preview` — preview the production build locally.
- `pnpm example` — runs the example project to try out the customizable grid with JSON data.

---

## Example Dashboard

The `example/` directory shares components from the library (with `@` aliasing to `../src`).  
It demonstrates:

- Combining KPI cards, charts, and tables in the grid;
- Filters using `useFilter`;
- Persistence of the grid state upon reload;
- Tailwind styling (the project imports `@tailwindcss/vite` and reuses the main design system).

> Tip: Try the customize mode in the example project to test different layouts; your changes will be saved in `localStorage`.

---

## Styles and Design System

- Tailwind enabled via `@tailwindcss/vite` and `tailwind-merge` utility for class composition;
- The `cn` function centralizes conditional merging;
- Components expose the `className` prop for local customization;
- Consistent tokens and spacing for great responsiveness.

---

## FAQ

**Layout changes disappear on reload. Why?**  
Be sure each grid has a unique `storageKey` or use the default `gridId` for persistence. Also, `localStorage` must be enabled in your browser.

**Tailwind styles aren't applied in the example project. What should I do?**  
Ensure you started with `pnpm example` and that `example/src/index.css` imports `@import "tailwindcss";`. Restart the dev server after any `tailwind.config.ts` changes.

**How do I build for Sankhya integration?**  
Run `pnpm build`. Copy `dist/` (or just `dist/sankhya-component.zip`) to the HTML5 component directory on your Sankhya server.

---

## Contributing

Contributions are welcome! Please open issues or PRs, keeping to code standards, running linters, and covering new scenarios with examples whenever possible.

---

## License

MIT © 2025 — You may use this template in both internal and distributed projects in compliance with the license.

---

<div align="center">

Made with ☕ by M.S.

</div>
