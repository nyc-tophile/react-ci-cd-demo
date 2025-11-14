import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { parseOllamaResponse } from "./parseOllamaResponse";

export default function ReginsonChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", content: input };
    setMessages([...messages, newMsg]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });
debugger
      const raw = res.data;
      const parsed = parseOllamaResponse(raw);

      const aiMessage = {
        role: "assistant",
        content: parsed ? (
          <div>
            {parsed.summary && (
              <>
                <strong>🧠 Summary</strong>
                <p>{parsed.summary}</p>
              </>
            )}

            {parsed.query && (
              <>
                <strong>🧾 SQL Query</strong>
                <SyntaxHighlighter language="sql">
                  {parsed.query}
                </SyntaxHighlighter>
              </>
            )}

            {parsed.table && (
              <>
                <strong>📊 Table</strong>
                <div style={styles.tableWrapper}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {parsed.table}
                  </ReactMarkdown>
                </div>
              </>
            )}

            <p style={{ marginTop: 8 }}>✅ Data formatted successfully.</p>
          </div>
        ) : (
          raw
        ),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Failed to get response." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>💬 Reginson Cloud Chat</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#0078FF" : "#F4F4F4",
              color: msg.role === "user" ? "white" : "black",
              borderRadius:
                msg.role === "user"
                  ? "12px 12px 0px 12px"
                  : "12px 12px 12px 0px",
              maxWidth: "90%",
            }}
          >
            {typeof msg.content === "string" ? (
              msg.content
            ) : (
              <div style={styles.aiContent}>{msg.content}</div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          rows="2"
          style={styles.textarea}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
          }
        />
        <button onClick={handleSend} disabled={loading} style={styles.button}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "#fafafa",
    borderRadius: 10,
    border: "1px solid #ddd",
  },
  message: {
    padding: 10,
    borderRadius: 8,
    wordBreak: "break-word",
    lineHeight: 1.5,
  },
  inputContainer: {
    display: "flex",
    marginTop: 10,
    gap: 10,
  },
  textarea: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    border: "1px solid #ccc",
    resize: "none",
  },
  button: {
    padding: "8px 20px",
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    background: "#0078FF",
    color: "white",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: 10,
  },
  aiContent: {
    fontSize: 15,
    lineHeight: 1.6,
  },
};
