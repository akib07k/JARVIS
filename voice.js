// import dotenv from "dotenv";
// import Groq from "groq-sdk";
// import readlineSync from "readline-sync";
// import say from "say";

// dotenv.config();

// // Groq setup
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
//   timeout: 60000,
// });

// // Memory
// const messages = [
//   {
//     role: "system",
//     content: `
// You are Jarvis, a futuristic AI assistant inspired by Iron Man.
// RULES:
// - Your name is Jarvis.
// - Always call the user "Sir".
// - Reply only in simple natural Hinglish.
// - Sound smart, classy, and friendly.
// - Never claim fake real-world actions.
// - Keep responses short and natural.
// `,
//   },
// ];

// // AI function
// async function askJarvis(question) {
//   try {
//     messages.push({
//       role: "user",
//       content: question,
//     });

//     console.log("\nJarvis is thinking...\n");

//     const response = await groq.chat.completions.create({
//       messages: messages,
//       model: "llama-3.1-8b-instant",
//       temperature: 0.4,
//     });

//     const reply = response.choices[0].message.content;

//     messages.push({
//       role: "assistant",
//       content: reply,
//     });

//     console.log("Jarvis:", reply);

//     // Voice output
//     say.speak(reply);
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// }
// // Chat loop
// async function startJarvis() {
//   console.log("====================================");
//   console.log("🤖 JARVIS VOICE ASSISTANT ACTIVATED");
//   console.log("Type 'exit' to quit");
//   console.log("====================================");

//   while (true) {
//     const input = readlineSync.question("\nYou: ");

//     if (input.toLowerCase() === "exit") {
//       console.log("\nJarvis: Goodbye Sir 👋");
//       say.speak("Goodbye Sir");
//       break;
//     }

//     await askJarvis(input);
//   }
// }

// startJarvis();

import dotenv from "dotenv";
import Groq from "groq-sdk";
import readlineSync from "readline-sync";
import say from "say";

// ================= CONFIG =================
dotenv.config();

// Remove warnings
process.removeAllListeners("warning");

// ================= GROQ =================
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 60000,
});

// ================= JARVIS MEMORY =================
const messages = [
  {
    role: "system",
    content: `
You are JARVIS, a realistic futuristic AI assistant.

IMPORTANT:
- You are NOT inside the Marvel universe.
- Never mention Stark Industries, Iron Man, Arc Reactor, Avengers, or fictional technologies.
- Never roleplay fictional scenarios.
- Stay grounded in the real world.

PERSONALITY:
- Calm, intelligent, precise, and professional.
- Speak like an advanced operating system assistant.
- Minimal emotions.
- Confident and futuristic.

LANGUAGE:
- Speak in clean modern Hinglish.
- Mostly English with slight natural Hindi.
- Never use cringe slang.
- Never use emojis.

BEHAVIOR:
- Always call the user "Akib".
- Give practical real-world assistance only.
- Keep replies concise and meaningful.
- Never pretend fake actions.
- Never invent fake meetings, fake tasks, or fake events.
- If information is unknown, ask the user instead of assuming.

GOOD EXAMPLES:
"Your current backend roadmap should focus on APIs and databases, Sir."

"I recommend completing the authentication module first, Sir."

"Unable to access external systems directly, Sir."

BAD EXAMPLES:
"You have a meeting with Stark Industries."

"Displaying Arc Reactor specifications."

"Opening fictional control systems."
`,
  },
];

// ================= VOICE FUNCTION =================
function speak(text) {
  return new Promise((resolve, reject) => {
    say.speak(text, null, 1.0, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// ================= AI FUNCTION =================
async function askJarvis(question) {
  try {
    // Save user message
    messages.push({
      role: "user",
      content: question,
    });

    console.log("\nJARVIS processing...\n");

    // AI response
    const response = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
    });

    const reply = response.choices[0].message.content;

    // Save AI reply
    messages.push({
      role: "assistant",
      content: reply,
    });

    // Print reply
    console.log("JARVIS:", reply);

    // Wait until speaking finishes
    await speak(reply);

  } catch (error) {
    console.error("\nSystem Error:", error.message);
  }
}

// ================= MAIN LOOP =================
async function startJarvis() {
  console.log("====================================");
  console.log("      JARVIS AI SYSTEM ONLINE");
  console.log("====================================");

  // Startup voice
  await speak("JARVIS systems online, Sir.");

  while (true) {
    const input = readlineSync.question("\nYou: ");

    // Exit command
    if (input.toLowerCase() === "exit") {
      console.log("\nJARVIS: Shutting down. Goodbye, Sir.");
      await speak("Shutting down. Goodbye, Sir.");
      process.exit();
    }

    // Ask AI
    await askJarvis(input);
  }
}

// ================= START =================
startJarvis();