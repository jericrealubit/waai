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
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="clipboard-write"
      />
    </div>
  );
}
