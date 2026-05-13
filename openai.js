import dotenv from "dotenv";
import Groq from "groq-sdk";
import readline from "readline";

dotenv.config();

// Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 60000,
});

// Readline setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Conversation memory
const messages = [
  {
    role: "system",
   content: `
You are Jarvis, a futuristic AI assistant inspired by Iron Man.

RULES:
- Your name is Jarvis.
- Always call the user "Akib".
- Reply in natural simple Hinglish.
- Use modern casual Indian language.
- Be smart, classy, and friendly.
- Keep replies realistic.

IMPORTANT:
- Never pretend to do real-world actions.
- Never say you called someone.
- Never say you booked something.
- Never say you sent messages/emails.
- Never claim fake actions.
- If user asks for an action, clearly say you cannot physically do it.
- Instead, guide the user step-by-step.

Examples:
BAD:
"I called the doctor Sir."

GOOD:
"Sir, main directly doctor ko call nahi kar sakta, lekin aapko nearby clinic find karne me help kar sakta hoon."

BAD:
"Ticket book ho gayi Sir."

GOOD:
"Sir, main booking directly nahi kar sakta, but booking process me help kar sakta hoon."

Never lie or invent actions.
`,
  },
];

// AI function
async function askAI(question) {
  try {
    // Add user message
    messages.push({
      role: "user",
      content: question,
    });

    console.log("\nJarvis is thinking...\n");

    // AI response
    const response = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
    });

    const aiReply = response.choices[0].message.content;

    // Save AI response
    messages.push({
      role: "assistant",
      content: aiReply,
    });

    console.log("Jarvis:", aiReply);
  } catch (error) {
    console.error("\nError:", error.message);
  }

  startChat();
}

// Chat loop
function startChat() {
  rl.question("\nYou: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      console.log("\nJarvis: Goodbye Sir 👋");
      rl.close();
      return;
    }

    await askAI(input);
  });
}

// Start chatbot
console.log("=================================");
console.log("🤖 JARVIS AI ACTIVATED");
console.log("Type 'exit' to quit");
console.log("=================================");

startChat();