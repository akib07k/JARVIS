import readlineSync from "readline-sync";
import say from "say";
import { loadMemory, getJarvisResponse, clearMemory } from "./jarvis.js";

// ANSI Colors for Terminal UI
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

/**
 * Converts text to speech
 */
function speak(text) {
  return new Promise((resolve) => {
    const cleanText = text.replace(/\*/g, "");
    say.speak(cleanText, null, 1.0, (err) => {
      if (err) console.error(`${colors.red}Voice Error:${colors.reset}`, err);
      resolve();
    });
  });
}

/**
 * CLI Main Loop
 */
async function startJarvis() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}================================================`);
  console.log("          JARVIS AI SYSTEM (CLI MODE)           ");
  console.log("================================================${colors.reset}\n");

  const greeting = "Systems stabilized. Welcome back, Sir.";
  console.log(`${colors.green}JARVIS:${colors.reset} ${greeting}`);
  await speak(greeting);

  while (true) {
    const input = readlineSync.question(`\n${colors.blue}${colors.bright}You > ${colors.reset}`);
    if (!input || input.trim() === "") continue;

    const command = input.toLowerCase().trim();

    if (command === "exit" || command === "quit") {
      console.log(`\n${colors.green}JARVIS:${colors.reset} Shutting down. Goodbye, Sir.`);
      await speak("Shutting down. Goodbye, Sir.");
      process.exit();
    }

    if (command === "clear") {
      await clearMemory();
      console.log(`${colors.magenta}Memory cleared, Sir.${colors.reset}`);
      await speak("Memory cleared, Sir.");
      continue;
    }

    if (command === "show") {
      const messages = await loadMemory();
      console.log(`\n${colors.magenta}--- SAVED LOGS ---${colors.reset}`);
      messages.forEach(msg => {
        if (msg.role === "system") return;
        const color = msg.role === "user" ? colors.blue : colors.green;
        console.log(`${colors.yellow}[${msg.timestamp || "N/A"}]${colors.reset} ${color}${msg.role.toUpperCase()}:${colors.reset} ${msg.content}`);
      });
      continue;
    }

    try {
      console.log(`\n${colors.cyan}JARVIS is processing...${colors.reset}\n`);
      const reply = await getJarvisResponse(input);
      console.log(`${colors.green}${colors.bright}JARVIS:${colors.reset} ${reply}`);
      await speak(reply);
    } catch (error) {
      console.error(`${colors.red}System Error:${colors.reset}`, error.message);
    }
  }
}

startJarvis().catch(console.error);