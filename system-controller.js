import open from "open";
import si from "systeminformation";
import { exec } from "child_process";

/**
 * Dictionary of popular websites mapped to their standard domains.
 * Extremely easy to expand and customize.
 */
const WEBSITE_MAPPINGS = {
  google: "google.com",
  "google search": "google.com",
  youtube: "youtube.com",
  github: "github.com",
  wikipedia: "wikipedia.org",
  reddit: "reddit.com",
  stackoverflow: "stackoverflow.com",
  gmail: "mail.google.com",
  facebook: "facebook.com",
  instagram: "instagram.com",
  twitter: "twitter.com",
  x: "x.com",
  linkedin: "linkedin.com",
  amazon: "amazon.com",
  netflix: "netflix.com",
  yahoo: "yahoo.com",
  bing: "bing.com"
};

/**
 * Dictionary of local applications.
 */
const APP_MAPPINGS = {
  chrome: "chrome",
  vscode: "code",
  notepad: "notepad",
  calculator: "calc",
};

/**
 * JARVIS System Controller
 * Handles automation tasks like opening apps, websites, and system stats.
 */
export const systemController = {
  // Open a website with robust error handling
  openWebsite: async (url) => {
    try {
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
      console.log(`[systemController] Attempting to open website: ${formattedUrl}`);
      
      // Launching default browser automatically
      await open(formattedUrl);
      return `Opening ${url}, Sir.`;
    } catch (error) {
      console.error(`[systemController] Failed to open website ${url}:`, error.message);
      return `I encountered an issue opening the browser for ${url}, Sir. Please ensure a default web browser is configured.`;
    }
  },

  // Open a common application with robust error handling
  openApp: async (appName) => {
    const cmd = APP_MAPPINGS[appName.toLowerCase()] || appName;
    console.log(`[systemController] Attempting to open application: ${appName} (command: ${cmd})`);
    
    return new Promise((resolve) => {
      exec(cmd, (error) => {
        if (error) {
          console.error(`[systemController] Failed to launch app ${appName}:`, error.message);
          resolve(`I couldn't find or execute ${appName} in the system path, Sir.`);
        } else {
          resolve(`Launching ${appName}, Sir.`);
        }
      });
    });
  },

  // Get current system info
  getSystemInfo: async () => {
    try {
      const battery = await si.battery();
      const cpu = await si.currentLoad();
      const time = new Date().toLocaleTimeString();
      const date = new Date().toLocaleDateString();

      let info = `The current time is ${time} on ${date}, Sir. `;
      
      if (battery.hasBattery) {
        info += `Battery is at ${battery.percent}%. `;
      }
      
      info += `CPU usage is currently at ${Math.round(cpu.currentLoad)}%.`;
      
      return info;
    } catch (error) {
      console.error(`[systemController] Failed to fetch system info:`, error.message);
      return `I was unable to retrieve the latest system biometrics, Sir.`;
    }
  },

  // Search Google with robust error handling
  searchGoogle: async (query) => {
    try {
      console.log(`[systemController] Attempting Google search for: "${query}"`);
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      await open(url);
      return `Searching Google for "${query}", Sir.`;
    } catch (error) {
      console.error(`[systemController] Failed to search Google for "${query}":`, error.message);
      return `I encountered an issue launching the browser for your search, Sir.`;
    }
  },

  /**
   * Parses and handles direct voice or typed commands.
   * Keeps implementation modular, robust, and easy to expand.
   * Returns a response string if a command was handled, or null to fallback to LLM.
   */
  handleDirectCommand: async (input) => {
    if (!input || typeof input !== "string") return null;
    
    // Remove trailing punctuation (. ? !) commonly added by browser voice recognition
    const sanitizedInput = input.trim().replace(/[.?!\s]+$/, "");
    const cleaned = sanitizedInput.toLowerCase().trim();

    // 1. Check for system information requests (fast-path)
    const isSysInfo = cleaned.includes("time") || 
                      cleaned.includes("date") || 
                      cleaned.includes("system info") || 
                      cleaned.includes("battery") ||
                      cleaned.includes("system status") ||
                      cleaned.includes("cpu");
    
    if (isSysInfo && !cleaned.includes("search") && !cleaned.includes("open")) {
      return await systemController.getSystemInfo();
    }

    // 2. Check for search requests
    const searchPrefixes = [
      "open google.com and search for ",
      "open google.com and search ",
      "open google.com search for ",
      "open google.com search ",
      "open google and search for ",
      "open google and search ",
      "open google search for ",
      "open google search ",
      "google search for ",
      "google search ",
      "search google for ",
      "search google ",
      "search for ",
      "search ",
      "google ",
      "look up ",
      "find "
    ];

    let searchQuery = null;
    for (const prefix of searchPrefixes) {
      if (cleaned.startsWith(prefix)) {
        searchQuery = sanitizedInput.substring(prefix.length).trim();
        break;
      }
    }

    if (searchQuery) {
      let finalQuery = searchQuery;
      // Clean trailing context if the user specifies 'on google'
      if (finalQuery.toLowerCase().endsWith(" on google")) {
        finalQuery = finalQuery.substring(0, finalQuery.length - 10).trim();
      } else if (finalQuery.toLowerCase().endsWith(" on the web")) {
        finalQuery = finalQuery.substring(0, finalQuery.length - 11).trim();
      }
      
      if (finalQuery) {
        return await systemController.searchGoogle(finalQuery);
      }
    }

    // 3. Check for open website or app requests
    const openPrefixes = [
      "open ",
      "launch ",
      "go to ",
      "browse "
    ];

    let openTarget = null;
    for (const prefix of openPrefixes) {
      if (cleaned.startsWith(prefix)) {
        openTarget = sanitizedInput.substring(prefix.length).trim();
        break;
      }
    }

    if (openTarget) {
      const targetLower = openTarget.toLowerCase();
      
      // Check website mappings
      if (WEBSITE_MAPPINGS[targetLower]) {
        return await systemController.openWebsite(WEBSITE_MAPPINGS[targetLower]);
      }
      
      // Check standard web domains
      if (targetLower.includes(".") || targetLower.includes("www") || targetLower.startsWith("http")) {
        return await systemController.openWebsite(openTarget);
      }
      
      // Check application mappings
      if (APP_MAPPINGS[targetLower]) {
        return await systemController.openApp(targetLower);
      }
      
      // Single word alphanumeric target default to website if not mapped
      if (/^[a-zA-Z0-9]+$/.test(targetLower)) {
        return await systemController.openWebsite(`${targetLower}.com`);
      }

      // Default to app execution
      return await systemController.openApp(openTarget);
    }

    // Fallback to LLM
    return null;
  }
};
