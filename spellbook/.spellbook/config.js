/**
 * @TODO - This file is losing nested functions when Object.assigned to incoming local config
 */

module.exports = {
  spinner: {
    frames: ["⠋", "⠙", "⠚", "⠞", "⠖", "⠦", "⠴", "⠲", "⠳", "⠓"],
    interval: 100,
    endFrame: "🎴 ",
    endFrames: ["🎴 ", "🧙 ", "⚗️ "],
    phrases: ["Your knowledge has increased", "Ask again later", "LEVEL UP"],
    endText: "Your knowledge has increased",
  },
  bootup: {
    delay: 3000,
    text: {
      start: "spellbook...",
      end: "spellbook",
      style: (text) => {
        // return chalk.black.bgBlue(` ${text} `);
        return text;
      },
    },
  },
  log: {
    root: "./src/",
    options: {
      includeVersion: true,
      includeTimestamp: true,
      includeHeader: false,
      header: "./.spellbook/header.md",
      path: "./SPELLBOOK.md",
      omittedTags: ["author", "return", "param", "function", "see"],
      tagPriority: ["NOTE", "TODO", "UPDATE", "ERROR"],
      filePriority: [/App/i],
    },
  },
  spells: [
    {
      name: "Do something",
      callback: (config) => {
        console.log("\n\nSomething happens.\n");
      },
    },
  ],
  cancel: {
    prompt: {
      name: "🗙",
      value: "CANCEL",
    },
    callback() {
      console.log("🙏  You too");
      console.log("");
    },
  },
};
