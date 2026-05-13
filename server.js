import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import say from "say";
import { getJarvisResponse, loadMemory, clearMemory } from "./jarvis.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, restrict this to your frontend URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Voice Output Utility
 */
function speak(text) {
  return new Promise((resolve) => {
    const cleanText = text.replace(/\*/g, "");
    say.speak(cleanText, null, 1.0, (err) => {
      if (err) console.error("Voice Error:", err);
      resolve();
    });
  });
}

// ================= SOCKET.IO (REAL-TIME) =================

io.on("connection", (socket) => {
  console.log(`\n📡 Client connected: ${socket.id}`);

  // Handle Chat Message
  socket.on("user_message", async (data) => {
    try {
      const { message } = data;
      console.log(`\nUser: ${message}`);

      // Emit "thinking" state
      socket.emit("jarvis_thinking", true);

      // Get Response from Core
      const response = await getJarvisResponse(message);

      // Speak (Optional: Can be handled client-side too)
      await speak(response);

      // Send Response back to client
      socket.emit("jarvis_response", { text: response });
      socket.emit("jarvis_thinking", false);

    } catch (error) {
      console.error("Socket Error:", error.message);
      socket.emit("error", "Failed to process message, Sir.");
      socket.emit("jarvis_thinking", false);
    }
  });

  socket.on("disconnect", () => {
    console.log(`\n🔌 Client disconnected: ${socket.id}`);
  });
});

// ================= REST API (BACKUP/HISTORY) =================

app.get("/api/history", async (req, res) => {
  try {
    const messages = await loadMemory();
    res.json(messages.filter(m => m.role !== "system"));
  } catch (error) {
    res.status(500).json({ error: "Failed to load history" });
  }
});

app.post("/api/clear", async (req, res) => {
  try {
    await clearMemory();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear memory" });
  }
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`\n🚀 JARVIS REAL-TIME Server running at http://localhost:${PORT}`);
});
