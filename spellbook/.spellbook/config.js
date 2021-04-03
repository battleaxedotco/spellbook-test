module.exports = {
  spinner: {
    frames: ["◢◢◢◢◢◢", "◣◣◣◣◣◣"],
    interval: 100,
    color: "red",
    endFrame: "🎴",
    endFrames: ["🎴", "🧙", "⚗️", "🧛"],
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
      header: "./.spellbook/header.md",
      path: "./SPELLBOOK.md",
      omittedTags: ["author", "return", "param", "function", "see"],
      tagPriority: ["NOTE", "TODO", "UPDATE", "ERROR"],
      filePriority: [/App/i, "Home", /about/],
    },
  },
};
