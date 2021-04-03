/**
 * This is a modular test file.
 * The purpose is to seek and identify any "@_____" comments within all files
 * of a directory, then document and dynamically link them within a .md file
 *
 * We may have specialized needs for commands / scripts per project though,
 * which is why spellbook is easily configurable/extensible compared to bombino
 */

const path = require("path");
const fs = require("fs");

// This will eventually be pointing to the NPM package instead of a local file
let UTILS = require("../spellbook/utils/arcanophile");

async function generateLogFile(CONFIG) {
  let TARGETS = await getListOfAllFilesFromRoot(CONFIG);
  // console.log(TARGETS);
  let DATA = await generateLogDataArray(CONFIG, TARGETS);
}

async function generateLogDataArray(CONFIG, TARGETS) {
  const RX = {
    newline: /\n/gm,
    hasTag: /@\w{1,}/,
    hasExtendedComment: /^\s{1,}(\*|\/)(\*|\/)?\*?/,
    hasShortComment: /(?<!:)\/\/.*$/,
    commentPrefix: /^.*((\*|\/\*)|\/\/)\/?/,
  };

  let RESULT = [];
  for (let TARGET of TARGETS) {
    RESULT.push({
      path: TARGET,
      name: path.basename(TARGET),
      content: await UTILS.readFile(TARGET),
    });
  }
  let FAKEDOC = {
    time: "null",
    files: [],
  };
  RESULT = RESULT.map((file) => {
    const DOC = {
      name: file.name,
      groups: [],
    };
    const TEMP = {
      path: file.path,
      content: file.content.data,
      stats: file.content.stats,
      lines: file.content.data.split(RX.newline),
    };
    TEMP.lines = TEMP.lines.map((line, i) => {
      let child = {
        content: line,
        number: i + 1,
        index: i,
        hasComment:
          RX.hasExtendedComment.test(line) || RX.hasShortComment.test(line),
      };
      if (child.hasComment) {
        child["comment"] = line.replace(RX.commentPrefix, "");
        child["hasTag"] = RX.hasTag.test(child.comment);
        if (child.hasTag)
          child["tag"] = child.comment.match(RX.hasTag)[0].replace(/\s*@/, "");
        child["groupIndex"] = null;
      }
      return child;
    });
    const COMMENT_INDICES = TEMP.lines
      .filter((line) => {
        return line.hasComment && line.comment;
      })
      .map((line) => {
        return line.index;
      });

    let GROUPS = COMMENT_INDICES.reduce((r, n) => {
      const lastSubArray = r[r.length - 1];
      if (!lastSubArray || lastSubArray[lastSubArray.length - 1] !== n - 1) {
        r.push([]);
      }
      r[r.length - 1].push(n);
      return r;
    }, []);

    GROUPS = GROUPS.map((g) => {
      let groupContainer = {
        children: g.map((index) => {
          return TEMP.lines[index];
        }),
      };
      groupContainer["tags"] = groupContainer.children
        .map((childContainer) => {
          return childContainer.comment;
        })
        .filter((childComment) => {
          return RX.hasTag.test(childComment);
        })
        .map((childComment) => {
          return childComment.match(RX.hasTag)[0].replace(/@/, "");
        })
        .filter((childComment) => {
          return childComment.length;
        });

      groupContainer["data"] = groupContainer.children
        .reduce((prev, curr) => [...prev, curr.comment], [])
        .join(`\n`);
      return groupContainer;
    });

    DOC["groups"] = GROUPS;
    FAKEDOC.files.push(DOC);
    return TEMP;
  });

  let TAGS = [];
  RESULT.forEach((file) => {
    file.lines.forEach((lines) => {});
  });
  UTILS.makeFile(path.resolve("./test.json"), JSON.stringify(RESULT));
  UTILS.makeFile(path.resolve("./fakedoc.json"), JSON.stringify(FAKEDOC));
  // console.log(CONFIG.spinner);
}

async function getListOfAllFilesFromRoot(CONFIG) {
  const ROOT = path.resolve(CONFIG.log.root);
  // console.log(ROOT);
  return await UTILS.readDirForAllChildren(ROOT, ["png", "md"]);
}

module.exports = generateLogFile;
