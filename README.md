# Campus Connect
Phase 1: landing page only (`/`). Backend folders are empty placeholders.

    cd frontend && npm install && npm run dev

- Theme: `src/context/ThemeContext` sets `data-theme` on `<html>`; all colours are CSS tokens in `src/styles/global.css`.
- Images: `src/assets/images/campus/` (edit `index.js` to swap).
- Content: `src/data/content.js`.
- Login/Sign Up buttons already point to `/login` and `/register`; add pages in `src/pages/` and routes in `src/routes/AppRoutes.jsx`.
