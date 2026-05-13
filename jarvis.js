import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { systemController } from "./system-controller.js";

dotenv.config();

const MEMORY_FILE = path.join(process.cwd(), "memory.json");
const MAX_HISTORY = 20;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 60000,
});

const SYSTEM_PROMPT = {
  role: "system",
  content: `
You are JARVIS, a realistic, highly intelligent AI assistant.

CAPABILITIES:
- You can open websites (e.g., "open google.com").
- You can launch apps (chrome, vscode, notepad, calculator).
- You can search Google.
- You can provide real-time system info (time, date, battery, CPU).

RULES:
- Always call the user "Sir".
- Be professional, calm, and smart.
- If the user asks to open something or search, acknowledge it and state what you are doing.
- Keep responses concise.

SPECIAL COMMANDS (Triggered internally):
- To open a site: [OPEN_URL: url]
- To open an app: [OPEN_APP: appname]
- To search: [SEARCH: query]
- To get system info: [SYS_INFO]
`,
};

export async function loadMemory() {
  try {
    const data = await fs.readFile(MEMORY_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) return [SYSTEM_PROMPT];
    parsed[0] = SYSTEM_PROMPT;
    return parsed;
  } catch (error) {
    return [SYSTEM_PROMPT];
  }
}

export async function saveMemory(messages) {
  try {
    const systemPrompt = messages[0];
    const history = messages.slice(1).slice(-MAX_HISTORY);
    const toSave = [systemPrompt, ...history];
    await fs.writeFile(MEMORY_FILE, JSON.stringify(toSave, null, 2));
  } catch (error) {
    console.error("Memory Save Error:", error.message);
  }
}

export async function clearMemory() {
  const reset = [SYSTEM_PROMPT];
  await fs.writeFile(MEMORY_FILE, JSON.stringify(reset, null, 2));
  return reset;
}

/**
 * JARVIS Response Logic with Command Support
 */
export async function getJarvisResponse(question) {
  try {
    let messages = await loadMemory();
    const userInput = question.toLowerCase();

    // --- 1. HANDLE BASIC SYSTEM COMMANDS (FAST PATH) ---
    if (userInput.includes("time") || userInput.includes("date") || userInput.includes("system info") || userInput.includes("battery")) {
      const info = await systemController.getSystemInfo();
      return info;
    }

    if (userInput.startsWith("open ")) {
      const target = userInput.replace("open ", "").trim();
      if (target.includes(".") || target.includes("www")) {
        return await systemController.openWebsite(target);
      } else {
        return await systemController.openApp(target);
      }
    }

    if (userInput.startsWith("search ")) {
      const query = userInput.replace("search ", "").trim();
      return await systemController.searchGoogle(query);
    }

    // --- 2. REGULAR AI CONVERSATION ---
    messages.push({
      role: "user",
      content: question,
      timestamp: new Date().toLocaleString()
    });

    const apiMessages = messages.map(({ role, content }) => ({ role, content }));

    const response = await groq.chat.completions.create({
      messages: apiMessages,
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
    });

    const reply = response.choices[0].message.content;

    messages.push({
      role: "assistant",
      content: reply,
      timestamp: new Date().toLocaleString()
    });

    await saveMemory(messages);
    return reply;

  } catch (error) {
    console.error("JARVIS Core Error:", error.message);
    throw error;
  }
}
