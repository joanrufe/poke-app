# Pokémon Explorer App

A modern, performant web application for browsing, searching, and exploring Pokémon data using the [PokeAPI](https://pokeapi.co/). The app features infinite scrolling, type filtering, favorites, Pokémon details, move information, and dark/light theme support. Performance is a key focus, leveraging libraries like React Query for efficient data fetching and UI updates.

## Features

- **Browse Pokémon**: Paginated and infinite scroll lists of Pokémon with images, types, and details.
- **Search**: Fast, auto-suggest search for Pokémon by name.
- **Type Filtering**: View Pokémon by type and see type effectiveness charts.
- **Favorites**: Mark and view favorite Pokémon (client-side persistence).
- **Details**: View detailed stats, moves, and type information for each Pokémon.
- **Dark/Light Theme**: Switch between dark and light mode for a better user experience.
- **Responsive UI**: Mobile-friendly, modern design.
- **E2E Testing**: Automated tests with Playwright.

## Technologies & Libraries

- **Next.js**: React framework for server-side rendering, routing, and fast development.
  - File-based routing, SSR/SSG, API routes, great developer experience.
- **TypeScript**: Static typing for safer, more maintainable code.
  - Early error detection, better IDE support, improved refactoring.
- **@tanstack/react-query**: Data fetching, caching, and state management for server data.
  - Handles caching, background updates, and pagination out of the box.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
  - Fast styling, responsive design, no custom CSS bloat.
- **shadcn/ui**: Component library for rapidly building accessible and beautiful UI.
  - Accelerates UI development with ready-to-use components, and is built on top of Radix UI for accessibility and composability.
- **Lucide React**: Icon library for modern SVG icons.
  - Lightweight, customizable, easy to use.
- **Playwright**: End-to-end testing framework.
  - Fast, reliable, supports multiple browsers, great for CI.

## Folder Structure

- `app/` — Next.js app directory (pages, layouts, routes)
- `components/` — Reusable UI and feature components
- `hooks/` — Custom React hooks (data fetching, infinite scroll, etc.)
- `lib/` — API clients and utility functions
- `public/` — Static assets (images, icons)
- `e2e-tests/` — Playwright end-to-end tests

## How to Run

1. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```
2. Start the development server:
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
3. Run E2E tests:
   ```sh
   pnpm test:e2e
   ```

## Scalability & Improvement Points

While this project is a technical test using a simple Pokémon API, here are some considerations if it were to scale:

- **Feature/domain-based structure**: Instead of organizing by type (hooks, components, etc.), a scalable project should use a feature/domain-based structure (e.g. Pokemons, Trainers, Areas, Abilities), grouping logic, components, and hooks by domain for better maintainability.
- **Better SSR**: Currently, most rendering is client-side or SSG. For improved SEO and initial load performance, a more advanced SSR implementation with Next.js would be recommended.

---

This project demonstrates a modern, scalable approach to building a feature-rich React app with best practices for data fetching, UI, and testing.
