# Gemini Chatbot Design

## Goal

Add a PilahNusa AI chatbot focused on waste sorting education and disposal guidance, powered by Gemini through the existing Express backend.

## Scope

The chatbot answers user questions about waste categories, sorting decisions, recycling, composting, hazardous waste handling, environmental impact, and practical disposal steps. It should answer in Indonesian and politely redirect questions that are unrelated to waste education.

## Architecture

The frontend adds a dedicated `/chatbot` page and navigation entry. The page owns chat UI state, sends messages to the backend, and renders assistant replies, loading states, errors, and quick prompt buttons.

The backend adds `POST /api/chatbot`. This endpoint validates the message, calls the Gemini API using `GEMINI_API_KEY` from environment variables, and wraps every user message with a focused system instruction for PilahNusa waste education. Keeping the Gemini call server-side prevents the API key from being exposed in browser code.

## Components

- `server/controllers/chatbotController.js`: validates input, builds the Gemini request, calls Gemini, normalizes errors, and returns `{ reply }`.
- `server/routes/apiRoutes.js`: registers `POST /chatbot`.
- `src/services/chatbotService.js`: sends chat messages to `/api/chatbot`.
- `src/pages/ChatbotPage.jsx`: renders the chat experience and handles user interaction.
- `src/App.jsx`: registers the `/chatbot` route.
- `src/components/layout/Sidebar.jsx`: adds a desktop Chatbot menu item.
- `src/components/layout/BottomNav.jsx`: adds a mobile Chatbot menu item.
- `.env.example`: documents `GEMINI_API_KEY`.

## Data Flow

1. User opens the Chatbot page.
2. User selects a quick prompt or types a waste-related question.
3. Frontend posts `{ message }` to `/api/chatbot`.
4. Backend validates the message and API key.
5. Backend calls Gemini with a system instruction that limits the assistant to waste sorting education.
6. Backend returns `{ reply }`.
7. Frontend appends the reply to the conversation.

## Error Handling

Empty messages are blocked before sending. Backend returns `400` for empty messages, `500` when `GEMINI_API_KEY` is missing, and a user-friendly response when Gemini fails or returns no text. The frontend shows a readable Indonesian error message and keeps the user message visible so the user can retry.

## Testing

Add focused backend controller tests for input validation and Gemini response handling. Add frontend service tests for successful replies and API errors. Run the project build after implementation to catch JSX and bundling regressions.

## Environment

Developers must copy `.env.example` to `.env` and set:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The implementation should use the existing `node-fetch` dependency for server-side HTTP calls and `axios` for frontend API calls, matching current project patterns.
