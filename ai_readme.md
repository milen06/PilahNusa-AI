# PilahNusa AI

PilahNusa AI is a mobile-first React application for classifying waste from a photo, then showing disposal guidance, recycling tips, and scan history. The current frontend is built with Vite and React Router, with a lightweight mock AI service in place of a real model/API integration.

## What the app does

- Lets users scan waste with the camera or upload an image from the gallery.
- Sends the captured image through a classifier hook and mock AI service.
- Displays the classification result on a dedicated result route.
- Stores scan history in `localStorage` so users can review previous results.
- Provides a guide page that explains how to use the app step by step.

## Tech stack

- React 18
- Vite
- React Router DOM
- Lucide React icons
- UUID for history item IDs

## Main routes

- `/` - Home page with hero content, feature highlights, and waste category preview.
- `/scan` - Camera capture and image upload flow.
- `/result/:id` - Detailed result view for a single scan.
- `/history` - Scan history with filtering, search, and delete actions.
- `/guide` - Usage guide and onboarding steps.

## How the scan flow works

1. The user opens `/scan`.
2. They choose either camera capture or gallery upload.
3. The selected image is compressed and converted to base64.
4. `useClassifier` calls `classifyWaste()` from `src/services/aiService.js`.
5. The result is saved to history through `useHistory`.
6. The app navigates to `/result/:id` with the result payload and image data.

## Current AI behavior

The classifier is still mocked. `src/services/aiService.js` returns one of a few predefined waste examples after a short delay. This keeps the UI and flow testable without a backend or external API key.

## State and storage

- Scan history is persisted in `localStorage` through helpers in `src/utils/storageUtils.js`.
- The app shows toast notifications globally from `App.jsx`.
- Camera access and capture are handled by `useCamera` and `CameraCapture`.

## Notable UI structure

- `src/components/layout/Layout.jsx` switches between a desktop sidebar and a mobile bottom navigation.
- `src/pages/HomePage.jsx` shows the landing hero and category overview.
- `src/pages/ScanPage.jsx` manages the scan states: idle, camera, preview, analyzing, and error.
- `src/pages/HistoryPage.jsx` provides filter chips, search, stats, and delete actions.

## Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Build the production bundle.
- `npm run lint` - Run ESLint.
- `npm run preview` - Preview the production build locally.

## Project notes for future AI work

- The app is currently frontend-only, so any real AI integration should replace the mock service in `src/services/aiService.js`.
- Keep scan history data shape compatible with the current result object structure so old entries keep working.
- Preserve the mobile-first layout and the existing route structure when extending the app.
