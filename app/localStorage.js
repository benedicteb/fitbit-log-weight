import { readFileSync, writeFileSync, statSync } from "fs";

import config from "../common/config.json";
import { debug } from "../common/log.js";

const getLocalStorage = () => {
  const filename = config.localStorageFile;
  
  try {
    statSync(filename);
  } catch (error) {
    debug(`Error reading storage file: ${error}`);
    return {};
  }

  const localStorage = readFileSync(filename, "json");

  debug(
    `Local storage fetched: ${JSON.stringify(localStorage, undefined, 2)}`
  );

  return localStorage;
};

const writeLocalStorage = (key, value) => {
  const filename = config.localStorageFile;
  const newStorage = getLocalStorage();
  let changed;

  if (newStorage[key]) {
    if (newStorage[key] !== value) {
      changed = true;
    } else {
      changed = false;
    }
  } else {
    changed = true;
  }

  newStorage[key] = value;

  writeFileSync(filename, newStorage, "json");

  debug(`Local storage written: ${JSON.stringify(newStorage, undefined, 2)}`);

  return changed;
};

export { getLocalStorage, writeLocalStorage };