import document from "document";

import { getDateString } from "../common/utils.js";
import { debug } from "../common/log.js";

import { getLocalStorage } from "localStorage";

const DATE = document.getElementById("date");
const STATUS_MESSAGE = document.getElementById("status-message");
const WEIGHT_LOGGED = document.getElementById("weight-logged");
const WEIGHT_ABOUT_TO_BE_LOGGED = document.getElementById(
  "weight-about-to-be-logged"
);

const ADD_BUTTON = document.getElementById("btn-add");
const SAVE_BUTTON = document.getElementById("btn-save");
const INCREASE_BUTTON = document.getElementById("btn-increment");
const DECREASE_BUTTON = document.getElementById("btn-decrease");
const ERROR_ICON = document.getElementById("error-icon");
const SPINNER = document.getElementById("spinner");
const TXT_BMI = document.getElementById("bmi");
const TXT_ERROR = document.getElementById("txt-error");

const NOTHING_LOGGED_MESSAGE = "No entry";
const DEFAULT_WEIGHT = 60;
const WEIGHT_INCREMENT = 0.1;
const SPINNER_TIMEOUT_SECONDS = 5;
const LOADING_TIMEOUT_SECONDS = 3;

const nothingLoggedToday = dateString => {
  DATE.text = dateString;
  STATUS_MESSAGE.text = NOTHING_LOGGED_MESSAGE;
  ADD_BUTTON.style.display = "inline";
  WEIGHT_LOGGED.text = "";
  TXT_BMI.text = "";
};

const renderAddEntry = () => {
  const localStorage = getLocalStorage();

  ADD_BUTTON.style.display = "none";
  SAVE_BUTTON.style.display = "inline";
  INCREASE_BUTTON.style.display = "inline";
  DECREASE_BUTTON.style.display = "inline";
  STATUS_MESSAGE.text = "";

  if (localStorage.latestEntry) {
    WEIGHT_ABOUT_TO_BE_LOGGED.text = `${localStorage.latestEntry} kg`;
  } else {
    WEIGHT_ABOUT_TO_BE_LOGGED.text = `${DEFAULT_WEIGHT} kg`;
  }
};

const renderIncreaseWeight = () => {
  incrementWeight(WEIGHT_INCREMENT);
};

const renderDecreaseWeight = () => {
  incrementWeight(-WEIGHT_INCREMENT);
};

const incrementWeight = increment => {
  const roundMethod = increment > 0 ? Math.ceil : Math.floor;
  const newValue = getCurrentAboutToBeLoggedWeight() + increment;
  const newValueRounded = roundMethod(newValue * 10) / 10.0;

  WEIGHT_ABOUT_TO_BE_LOGGED.text = `${newValueRounded} kg`;
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

const drawTodayScreen = () => {
  const localStorage = getLocalStorage();
  const todayString = getDateString(new Date());

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

      WEIGHT_LOGGED.text = `${today.value} kg`;
      TXT_BMI.text = `BMI: ${today.bmi}`;
      STATUS_MESSAGE.text = "";
      ADD_BUTTON.style.display = "none";
    }
  } else {
    WEIGHT_LOGGED.text = "";
    DATE.text = "";
    STATUS_MESSAGE.text = "Loading...";

    setTimeout(() => {
      const localStorage = getLocalStorage();

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
  }, SPINNER_TIMEOUT_SECONDS * 1000);
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
