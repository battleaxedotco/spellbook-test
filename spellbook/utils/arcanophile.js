const fs = require("fs");
const path = require("path");

function folderExists(targetPath, createOnRun = true) {
  if (!exists(targetPath) && createOnRun) makeFolder(targetPath);
  return exists(targetPath) && isFolder(targetPath);
}

function fileExists(targetPath) {
  return (
    exists(path.resolve(targetPath)) && !isFolder(path.resolve(targetPath))
  );
}

function exists(targetPath) {
  return fs.existsSync(path.resolve(targetPath));
}

function makeFolder(targetPath) {
  return fs.mkdirSync(path.resolve(targetPath));
}

function makeFile(targetPath, data, options = null) {
  return fs.writeFileSync(path.resolve(targetPath), data, options);
}

function isFolder(targetPath) {
  return fs.lstatSync(path.resolve(targetPath)).isDirectory();
}

async function readFiles(folderPath, verbose = true) {
  let mapped = [];
  for (const filepath in folderPath) mapped.push(await readFile(filepath));
  return mapped;
}

async function readFile(targetPath, verbose = true) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(targetPath), "utf-8", (err, data) => {
      if (err) reject(err);
      if (!verbose) resolve(data);
      let temp = {
        data: data,
        stats: fs.lstatSync(path.resolve(targetPath)),
      };
      resolve(temp);
    });
  });
}

async function readDirs(folderPaths, flatten = false) {
  let mapped = [];
  for (const item in folderPaths) mapped.push(await readDir(item, flatten));
  return flatten ? mapped.flat() : mapped;
}

async function readDir(targetPath) {
  return new Promise((resolve, reject) => {
    if (!exists(targetPath) || !isFolder(targetPath))
      reject("Path is not a folder or does not exist");
    fs.readdir(
      path.resolve(targetPath),
      { encoding: "utf-8" },
      (err, files) => {
        if (err) reject(err);
        resolve(files);
      }
    );
  });
}

async function readDirForAllChildren(targetPath, excludes) {
  let contents = await readDir(targetPath);
  let RESULT = [];
  for (let child of contents) {
    let cPath = `${targetPath.replace(/(\\|\/)$/, "")}/${child}`;
    if (isFolder(cPath))
      RESULT = [].concat(RESULT, await readDirForAllChildren(cPath, excludes));
    else RESULT.push(cPath);
  }
  return RESULT.map((item) => {
    return item.replace(/\\/gm, "/");
  }).filter((item) => {
    return !new RegExp(`${excludes.join("|")}$`).test(item);
  });
}

module.exports = {
  folderExists,
  fileExists,
  exists,
  makeFolder,
  makeFile,
  isFolder,
  readFiles,
  readFile,
  readDirs,
  readDir,
  readDirForAllChildren,
};
