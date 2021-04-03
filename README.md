# spellbook sandbox

Configurable, modular, extensible version of `bombino-commands` for easy CLI commands and interfaces:

![](https://thumbs.gfycat.com/ScaryClumsyCrownofthornsstarfish-size_restricted.gif)

Spellbook allows custom animation, prompts, messages, commands, functions and more via use of local config files relative to `./.spellbook/config.js`:

```js
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
    ],
  },
  spells: [
    {
      name: "🤘 Embrace forbidden knowledge",
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
        console.log("");
        console.log("");
        console.log("This function is being called from within a config file");
        console.log("");
      },
    },
  ],
  cancel: {
    prompt: {
      name: "🗙",
    },
    callback() {
      console.log("🙏  You too");
      console.log("");
    },
  },
};
```
