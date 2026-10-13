/**
 * The assistant's two addresses, declared once: /chat frames it in a plate,
 * and the floating launcher (components/chat-widget.tsx) opens it in a panel
 * on every other page.
 *
 * The app is a Chainlit bot on Hugging Face Spaces, deployed from CHAT_REPO's
 * `main` by a GitHub Action there. What it knows about the business comes from
 * /llms.txt (app/llms.txt/route.ts).
 */
export const CHAT_SRC = "https://jericrealubit-ragchatbot.hf.space";
export const CHAT_REPO = "https://github.com/jericrealubit/ragchatbot";
