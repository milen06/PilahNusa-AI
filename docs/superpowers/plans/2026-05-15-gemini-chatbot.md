# Gemini Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Gemini-powered PilahNusa chatbot focused on waste sorting education.

**Architecture:** Add a server-side `/api/chatbot` endpoint so the Gemini API key stays private, then connect a new React `/chatbot` page through a small frontend service. The UI follows the existing page-level CSS pattern and extends the existing sidebar and bottom navigation arrays.

**Tech Stack:** Express 5, node-fetch, React 18, React Router, axios, lucide-react, Node test runner.

---

## File Structure

- Create `server/controllers/chatbotController.js` for Gemini request construction, validation, and Express response handling.
- Create `server/controllers/chatbotController.test.js` using `node:test` and injected fetch functions.
- Modify `server/routes/apiRoutes.js` to register `POST /chatbot`.
- Create `src/services/chatbotService.js` for the frontend API call.
- Create `src/pages/ChatbotPage.jsx` for the user-facing chat page.
- Modify `src/App.jsx` to add the route.
- Modify `src/components/layout/Sidebar.jsx` to add desktop navigation.
- Modify `src/components/layout/BottomNav.jsx` to add mobile navigation.
- Modify `.env.example` to document `GEMINI_API_KEY`.

## Task 1: Backend Gemini Controller

- [x] Write failing Node tests for empty input, missing API key, successful Gemini reply, and empty Gemini response.
- [x] Run `node --test server/controllers/chatbotController.test.js` and confirm it fails because the controller does not exist.
- [x] Implement `server/controllers/chatbotController.js` with `createChatbotReply` and `chatWithWasteAssistant`.
- [x] Run `node --test server/controllers/chatbotController.test.js` and confirm tests pass.
- [x] Register `router.post('/chatbot', chatWithWasteAssistant)` in `server/routes/apiRoutes.js`.

## Task 2: Frontend Service

- [x] Create `src/services/chatbotService.js` with `sendChatbotMessage(message)`.
- [x] Make it post to `/api/chatbot` and normalize backend errors to Indonesian text.

## Task 3: Chatbot Page And Navigation

- [x] Create `src/pages/ChatbotPage.jsx` with welcome message, quick prompts, message bubbles, loading state, error state, and submit handling.
- [x] Add route `/chatbot` in `src/App.jsx`.
- [x] Add a `BotMessageSquare` navigation item in `Sidebar.jsx`.
- [x] Add a `BotMessageSquare` navigation item in `BottomNav.jsx`.
- [x] Update `.env.example` with `GEMINI_API_KEY=your_gemini_api_key_here`.

## Task 4: Verification

- [x] Run `node --test server/controllers/chatbotController.test.js`.
- [x] Run `npm run build`.
- [x] Review `git diff` to ensure only intended files changed, while preserving pre-existing user changes.
