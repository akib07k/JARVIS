import open from "open";
import si from "systeminformation";
import { exec } from "child_process";

/**
 * JARVIS System Controller
 * Handles automation tasks like opening apps, websites, and system stats.
 */

export const systemController = {
  // Open a website
  openWebsite: async (url) => {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    await open(formattedUrl);
    return `Opening ${url}, Sir.`;
  },

  // Open a common application
  openApp: async (appName) => {
    const apps = {
      chrome: "chrome",
      vscode: "code",
      notepad: "notepad",
      calculator: "calc",
    };

    const cmd = apps[appName.toLowerCase()] || appName;
    
    return new Promise((resolve) => {
      exec(cmd, (error) => {
        if (error) {
          resolve(`I couldn't find ${appName} in the system path, Sir.`);
        } else {
          resolve(`Launching ${appName}, Sir.`);
        }
      });
    });
  },

  // Get current system info
  getSystemInfo: async () => {
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
  },

  // Search Google
  searchGoogle: async (query) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await open(url);
    return `Searching Google for "${query}", Sir.`;
  }
};
