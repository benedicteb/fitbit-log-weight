import document from "document";

import {
  renderAddEntry,
  renderSaveEntry,
  renderIncreaseWeight,
  renderDecreaseWeight,
  getCurrentAboutToBeLoggedWeight
} from "draw";
import { sendVal } from "communication";
import { writeLocalStorage } from "localStorage";
import { getDateString } from "../common/utils.js";

const ADD_BUTTON = document.getElementById("btn-add");
const SAVE_BUTTON = document.getElementById("btn-save");
const INCREASE_BUTTON = document.getElementById("btn-increment");
const DECREASE_BUTTON = document.getElementById("btn-decrease");

const initListeners = () => {
  ADD_BUTTON.onactivate = event => {
    renderAddEntry();
  };

  SAVE_BUTTON.onactivate = event => {
    const value = getCurrentAboutToBeLoggedWeight();

    renderSaveEntry();

    sendVal({
      key: "WEIGHT_LOGGED_TODAY",
      value: value
    });

    writeLocalStorage("today", {
      date: getDateString(new Date()),
      value: value
    });
  };

  INCREASE_BUTTON.onactivate = event => {
    renderIncreaseWeight();
  };

  DECREASE_BUTTON.onactivate = event => {
    renderDecreaseWeight();
  };
};

export { initListeners };
