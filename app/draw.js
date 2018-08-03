import { getDateString, setNoDecimals } from "../common/utils.js";
import { debug } from "../common/log.js";

import {
  DATE,
  STATUS_MESSAGE,
  WEIGHT_LOGGED,
  WEIGHT_ABOUT_TO_BE_LOGGED,
  ADD_BUTTON,
  SAVE_BUTTON,
  INCREASE_BUTTON,
  DECREASE_BUTTON,
  ERROR_ICON,
  SPINNER,
  TXT_BMI,
  TXT_ERROR
} from "uiElements";

const NOTHING_LOGGED_MESSAGE = "No entry";
const WEIGHT_INCREMENT = 0.1;
const LOADING_TIMEOUT_SECONDS = 6;
const BMI_DECIMALS = 1;

const UNITS = {
  kg: {
    displayName: "kg",
    decimals: 1,
    increment: 0.1,
    defaultWeight: 60
  },
  pounds: {
    displayName: "lbs",
    decimals: 1,
    increment: 0.5,
    defaultWeight: 132
  },
  stone: {
    displayName: "st",
    decimals: 2,
    increment: 1 / 14,
    defaultWeight: 9.5
  }
};

const getUnit = localStorage => {
  if (localStorage.unit) {
    return UNITS[localStorage.unit];
  }

  return UNITS.kg;
};

const nothingLoggedToday = dateString => {
  DATE.text = dateString;
  STATUS_MESSAGE.text = NOTHING_LOGGED_MESSAGE;
  ADD_BUTTON.style.display = "inline";
  WEIGHT_LOGGED.text = "";
  TXT_BMI.text = "";
};

const renderAddEntry = localStorage => {
  const unit = getUnit(localStorage);

  ADD_BUTTON.style.display = "none";
  SAVE_BUTTON.style.display = "inline";
  INCREASE_BUTTON.style.display = "inline";
  DECREASE_BUTTON.style.display = "inline";
  STATUS_MESSAGE.text = "";

  if (localStorage.latestEntry) {
    WEIGHT_ABOUT_TO_BE_LOGGED.text = `${setNoDecimals(
      localStorage.latestEntry.value,
      unit.decimals,
      Math.floor
    )} ${unit.displayName}`;
  } else {
    WEIGHT_ABOUT_TO_BE_LOGGED.text = `${setNoDecimals(
      unit.defaultWeight,
      unit.decimals,
      Math.floor
    )} ${unit.displayName}`;
  }
};

const renderIncreaseWeight = localStorage => {
  const unit = getUnit(localStorage);
  incrementWeight(unit.increment, unit);
};

const renderDecreaseWeight = localStorage => {
  const unit = getUnit(localStorage);
  incrementWeight(-unit.increment, unit);
};

const incrementWeight = (increment, unit) => {
  const roundMethod = increment > 0 ? Math.ceil : Math.floor;
  const newValue = getCurrentAboutToBeLoggedWeight() + increment;
  const newValueRounded = setNoDecimals(newValue, unit.decimals, roundMethod);

  WEIGHT_ABOUT_TO_BE_LOGGED.text = `${newValueRounded} ${unit.displayName}`;
};

const getCurrentAboutToBeLoggedWeight = () => {
  const currentWeightText = WEIGHT_ABOUT_TO_BE_LOGGED.text.split(" ")[0];
  const currentWeight = parseFloat(currentWeightText);

  return currentWeight;
};

const renderSaveEntry = () => {
  ADD_BUTTON.style.display = "none";
  SAVE_BUTTON.style.display = "none";
  INCREASE_BUTTON.style.display = "none";
  DECREASE_BUTTON.style.display = "none";
};

const drawTodayScreen = localStorage => {
  const todayString = getDateString(new Date());
  const unit = getUnit(localStorage);

  if (localStorage.today) {
    // ^ Could be data from yesterday
    const today = localStorage.today;

    if (today.date != todayString) {
      // Saved date is not today
      nothingLoggedToday(todayString);
      return;
    }

    DATE.text = today.date;

    if (!today.value) {
      nothingLoggedToday(today.date);
    } else {
      clearError();

      WEIGHT_LOGGED.text = `${setNoDecimals(
        today.value,
        unit.decimals,
        Math.floor
      )} ${unit.displayName}`;
      TXT_BMI.text = `BMI: ${setNoDecimals(
        today.bmi,
        BMI_DECIMALS,
        Math.floor
      )}`;
      STATUS_MESSAGE.text = "";
      ADD_BUTTON.style.display = "none";
    }
  } else {
    WEIGHT_LOGGED.text = "";
    DATE.text = "";
    STATUS_MESSAGE.text = "Loading...";

    setTimeout(() => {
      if (!localStorage.today) {
        WEIGHT_LOGGED.text = "";
        DATE.text = "";
        STATUS_MESSAGE.text = "Visit settings to log in";

        stopSpinner();
      }
    }, LOADING_TIMEOUT_SECONDS * 1000);
  }
};

const renderError = () => {
  stopSpinner();
  ERROR_ICON.style.display = "inline";
  TXT_ERROR.text = "Error";
};

const clearError = () => {
  ERROR_ICON.style.display = "none";
  TXT_ERROR.text = "";
};

const startSpinner = () => {
  SPINNER.state = "enabled";

  setTimeout(() => {
    if (SPINNER.state === "enabled") {
      // If spinner still enabled after 5 seconds
      stopSpinner();
      renderError();
    }
  }, LOADING_TIMEOUT_SECONDS * 1000);
};

const stopSpinner = () => {
  SPINNER.state = "disabled";
};

export {
  drawTodayScreen,
  renderAddEntry,
  renderSaveEntry,
  renderIncreaseWeight,
  renderDecreaseWeight,
  getCurrentAboutToBeLoggedWeight,
  renderError,
  startSpinner,
  stopSpinner
};
