import axios from "axios";

const API_URL = "http://localhost:5000/api/chat";

export async function chatWithOllama(message) {
  try {
    const res = await axios.post(API_URL, { message });
    return res.data || "No reply.";
  } catch (err) {
    console.error("Backend error:", err);
    return "❌ Server error.";
  }
}
