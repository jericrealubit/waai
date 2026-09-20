import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistant | WA AI Digital",
  description:
    "Ask the WA AI Digital assistant about services, pricing and shipped work.",
  // The page renders an external iframe and nothing else, so there is no
  // content here for a crawler to index. app/robots.ts disallows it too.
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999, // Sits on top of your main header/footer
        backgroundColor: "#0d1117", // Matches Chainlit's dark mode background
        overflow: "hidden",
      }}
    >
      <iframe
        src="https://jericrealubit-ragchatbot.hf.space?__theme=dark"
        /* An iframe without a title is announced as just "frame" — the
           assistant is the entire page, so it needs a name. */
        title="WA AI Digital assistant"
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="clipboard-write"
      />
    </div>
  );
}
