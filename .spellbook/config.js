/**
 * This is the modern standard for config files used by Vue, Quasar, etc.
 *
 * Ideally bombino would have this same standard, but ironically spellbook could
 * replace bombino specifically because it's extensible whereas bombino is not.
 *
 * Create new files in this folder and invoke them in spell.callbacks like below
 */

module.exports = {
  spinner: {
    timeout: 1000,
    frames: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"],
    startText: "Studying the stars...",
    interval: 100,
    fortunes: [
      {
        phrase: "Your knowledge has increased",
        frame: "🎴",
      },
      {
        phrase: " The Labyrinth unfolds",
        frame: "🗝️",
      },
      {
        phrase: "The realms align",
        frame: "🌟",
      },
      {
        phrase: "Find harmony with Nature and the Machine",
        frame: "🔮",
      },
      {
        phrase: " Drink from the fathomless depths of all phenomena",
        frame: "⚗️",
      },
      {
        phrase: " Return to the Infinite",
        frame: "♾️",
      },
      {
        phrase: " Be at rest upon the sacred mountain",
        frame: "⛰️",
      },
      {
        phrase: " Merge the planes of existence",
        frame: "🌌",
      },
      {
        phrase: "Dream of unknowable power",
        frame: "💀",
      },
      {
        phrase: "Shape fragments of past and future",
        frame: "🧙",
      },
      {
        phrase: "Become the Lord of Time",
        frame: "⏳",
      },
      // {
      //   phrase: "LEVEL UP",
      //   frame: "🎲",
      // },
      // {
      //   phrase: " Here comes the Sun",
      //   frame: "☀️",
      // },
    ],
  },
  log: {
    root: "./src/",
    options: {
      includeVersion: true,
      includeTimestamp: true,
      header: "./.spellbook/header.md",
      path: "./SPELLBOOK.md",
      gitignore: false,
      omittedTags: ["author", "return", "param", "function", "see"],
      tagPriority: ["NOTE", "TODO", "UPDATE", "ERROR"],
      filePriority: [/App/i, "Home", /about/],
    },
  },
  spells: [
    {
      name: "🤘 Embrace forbidden knowledge",
      value: "LOG",
      /**
       * @param {Object} cfg - The config object / this file
       * This is done so that options determined here can bounce into your standalone functions
       */
      callback: async function(cfg) {
        await require("./generateLog")(cfg);
      },
    },
    {
      name: "🎲 Test your wits",
      callback: function(cfg) {
        const time = require("./getTime");
        let timestamp = time.getTimestamp();
        let now = time.getDate();
        console.log("");
        console.log("");
        console.log(`${timestamp}`);
        console.log(now);
        console.log("");
      },
    },
  ],
  cancel: {
    prompt: "🗙",
    callback() {
      console.log("🙏  You too");
      console.log("");
    },
  },
};
