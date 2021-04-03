#!/usr/bin/env node

/**
 * Deepmerging isn't working. Assigning default config results in overwritten functions of local
 * spells, need to potentially manually parse these.
 */

const deepMerge = require("deepmerge");
const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");

// These will eventually be pointing to NPM package instead of local files
let UTILS = require("../utils/arcanophile");
let CONFIG = require("../.spellbook/config");

/**
 * The main start function invoked by the "npm run spellbook" / "spellbook" command
 */
async function init() {
  CONFIG = await getConfig();
  if (CONFIG.bootup) await bootup();
  await spellPrompts();
}

/**
 * Will attempt to retrieve ./.spellbook/config.js if this exists, or will default to internal config
 * @returns {Object} - Configuration options to be passed to spell.callbacks
 */
async function getConfig() {
  let DEFAULT_CONFIG = CONFIG;
  let hasLocalConfig = UTILS.exists(
    `${path.resolve("./")}/.spellbook/config.js`
  );
  if (hasLocalConfig) {
    let LOCAL_CONFIG = require(`${path.resolve("./")}/.spellbook/config.js`);

    //
    // Should sanitize config in case it's missing required values
    // let MAIN_CONFIG = deepMerge(DEFAULT_CONFIG, LOCAL_CONFIG, {
    //   arrayMerge: (destinationArray, sourceArray, options) => sourceArray,
    // });
    let MAIN_CONFIG = LOCAL_CONFIG;
    UTILS.makeFile(
      `${path.resolve("./")}/.spellbook/config-template.json`,
      JSON.stringify(MAIN_CONFIG)
    );

    return MAIN_CONFIG;
  } else {
    // Create a file and folder relative to this project
    UTILS.makeFolder(`${path.resolve("./")}/.spellbook`);

    let templateContents = await UTILS.readFile(
      `${path.resolve("./")}/spellbook/.spellbook/config.js`,
      false
    );
    UTILS.makeFile(
      `${path.resolve("./")}/spellbook/.spellbook/config.json`,
      JSON.stringify({ template: templateContents })
    );
    let stringContents = await UTILS.readFile(
      `${path.resolve("./")}/spellbook/.spellbook/config.json`,
      false
    );
    UTILS.makeFile(
      `${path.resolve("./")}/.spellbook/config.js`,
      JSON.parse(stringContents).template
    );

    return DEFAULT_CONFIG;
  }
}

/**
 * Spellbook supports a bootup spinner prior to the list of spells.
 * If CONFIG.bootup exists, animate it and await the result
 */
async function bootup() {
  return new Promise((resolve, reject) => {
    console.log("");
    let SPINNER = ora({
      text: CONFIG.bootup.text.start,
      spinner: CONFIG.spinner,
      color: CONFIG.spinner.color,
    }).start();
    setTimeout(() => {
      SPINNER.stopAndPersist({
        symbol: CONFIG.spinner.endFrame,
        text: CONFIG.bootup.text.style(CONFIG.bootup.text.end),
      });
      console.log("");
      return resolve(true);
    }, CONFIG.bootup.delay);
  });
}

/**
 * Function to determine if a dynamic config choice was activated
 * @param {String} a - The value from an Inquirer prompt action
 * @param {String|Object} b - A choice within the config
 * @returns {Boolean} - whether or not prompt matched this choice
 */
function isSame(a, b) {
  let result = false;
  if (/object/i.test(typeof b)) {
    Object.keys(b).forEach((key) => {
      if (a == b[key]) result = true;
    });
  } else result = a == b;
  return result;
}

async function spellPrompts() {
  // Fire up an Inquirer prompt based on the current config
  let BOOT_PROMPT = [
    {
      type: "list",
      name: "action",
      choices: [].concat(CONFIG.spells || [], CONFIG.cancel.prompt),
    },
  ];
  const ANSWER = await inquirer.prompt(BOOT_PROMPT);

  // If the user cancelled, enact the callback
  if (isSame(ANSWER.action, CONFIG.cancel.prompt)) {
    CONFIG.cancel.callback();
    return true;
  } else {
    // Otherwise start the spinner, find their spell and enact it
    let SPINNER = ora({
      text: CONFIG.spinner.startText,
      spinner: CONFIG.spinner,
      color: CONFIG.spinner.color,
    }).start();
    let ACTIVE_CHOICE = BOOT_PROMPT[0].choices.find((choice) => {
      let result = isSame(ANSWER.action, choice);
      return result;
    });
    // If the callback is async then await it, otherwise just call it
    if (/^\s*async/.test(ACTIVE_CHOICE.callback.toString()))
      await ACTIVE_CHOICE.callback(CONFIG, ACTIVE_CHOICE);
    else ACTIVE_CHOICE.callback(CONFIG, ACTIVE_CHOICE);

    // If the config has an arbitrary spinner timeout, always prefer it
    if (CONFIG.spinner.timeout && CONFIG.spinner.timeout > 0) {
      setTimeout(() => {
        SPINNER.stopAndPersist(rollARandomSpinner());
        console.log("");
        return true;
      }, CONFIG.spinner.timeout);
    } else {
      SPINNER.stopAndPersist(rollARandomSpinner());
      console.log("");
      return true;
    }
  }
  return true;
}

/**
 * Used to randomize fortunes
 * @param {Number} min - Minimum number
 * @param {Number} max - Maximum number
 * @returns {Number} - A random number between min/max
 */
function randomNumber(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

/**
 * Generates a semi-random confirmation message.
 * @returns {Object} - A random fortune, endFrames, endText, or endFrame
 *
 * Prioritizes based on the following:
 *   - spinner.fortunes exists? Use that for both phrase and frame
 *   - spinner.phrases exists? Roll one of them for the phrase
 *   - spinner.endFrames exists? Roll one of them for the end frame
 *   - spinner.endFrame exists? Default to that.
 *   - spinner.endText exists? Default to that.
 *
 *   - If none of the above, use "🎴" frame and "Your knowledge has increased" message
 */
function rollARandomSpinner() {
  let phrase, frame;
  let hasFortunes = CONFIG.spinner.fortunes && CONFIG.spinner.fortunes.length,
    hasPhrases = CONFIG.spinner.phrases && CONFIG.spinner.phrases.length;
  hasFrames = CONFIG.spinner.endFrames && CONFIG.spinner.endFrames.length;
  let phraseMax = hasFortunes
    ? CONFIG.spinner.fortunes.length - 1
    : hasPhrases
    ? CONFIG.spinner.phrases.length - 1
    : 0;
  let frameMax = hasFortunes
    ? CONFIG.spinner.fortunes.length - 1
    : hasFrames
    ? CONFIG.spinner.endFrames.length - 1
    : 0;
  let phraseRoll = randomNumber(0, phraseMax);
  let frameRoll = hasFortunes ? phraseRoll : randomNumber(0, frameMax);
  let phraseTarget = hasFortunes
    ? CONFIG.spinner.fortunes
    : hasPhrases
    ? CONFIG.spinner.phrases
    : CONFIG.spinner.endText;
  let frameTarget = hasFortunes
    ? CONFIG.spinner.fortunes
    : hasFrames
    ? CONFIG.spinner.endFrames
    : CONFIG.spinner.endFrame;
  phrase = /string/i.test(phraseTarget)
    ? phraseTarget
    : phraseTarget[phraseRoll];
  if (/object/i.test(typeof phrase) && phrase.phrase) phrase = phrase.phrase;
  frame = /string/i.test(frameTarget) ? frameTarget : frameTarget[frameRoll];
  if (/object/i.test(typeof frame) && frame.frame) frame = frame.frame;
  return {
    symbol: frame,
    text: `${phrase}`,
  };
}

init();
