import { getDateString } from "../common/utils.js";

import { sendVal } from "communication";
import { startSpinner } from "draw";
import { writeLocalStorage } from "localStorage";

import {
  ADD_BUTTON,
  SAVE_BUTTON,
  INCREASE_BUTTON,
  DECREASE_BUTTON
} from "uiElements";

import {
  renderAddEntry,
  renderSaveEntry,
  renderIncreaseWeight,
  renderDecreaseWeight,
  getCurrentAboutToBeLoggedWeight
} from "draw";

const initListeners = localStorage => {
  ADD_BUTTON.onactivate = event => {
    renderAddEntry(localStorage);
  };

  SAVE_BUTTON.onactivate = event => {
    const value = getCurrentAboutToBeLoggedWeight();

    startSpinner();
    renderSaveEntry();

    sendVal({
      key: "WEIGHT_LOGGED_TODAY",
      value: value
    });

    localStorage.today = {
      date: getDateString(new Date()),
      value: value,
      bmi: null
    };

    writeLocalStorage(localStorage);
  };

  INCREASE_BUTTON.onactivate = event => {
    renderIncreaseWeight(localStorage);
  };

  DECREASE_BUTTON.onactivate = event => {
    renderDecreaseWeight(localStorage);
  };
};

export { initListeners };
