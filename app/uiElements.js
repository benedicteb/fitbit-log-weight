import document from "document";

const ADD_BUTTON = document.getElementById("btn-add");
const SAVE_BUTTON = document.getElementById("btn-save");
const INCREASE_BUTTON = document.getElementById("btn-increment");
const DECREASE_BUTTON = document.getElementById("btn-decrease");

const DATE = document.getElementById("date");
const STATUS_MESSAGE = document.getElementById("status-message");
const WEIGHT_LOGGED = document.getElementById("weight-logged");

const WEIGHT_ABOUT_TO_BE_LOGGED = document.getElementById(
  "weight-about-to-be-logged"
);

const ERROR_ICON = document.getElementById("error-icon");
const SPINNER = document.getElementById("spinner");
const TXT_BMI = document.getElementById("bmi");
const TXT_ERROR = document.getElementById("txt-error");

export {
  ADD_BUTTON,
  SAVE_BUTTON,
  INCREASE_BUTTON,
  DECREASE_BUTTON,
  DATE,
  STATUS_MESSAGE,
  WEIGHT_LOGGED,
  WEIGHT_ABOUT_TO_BE_LOGGED,
  ERROR_ICON,
  SPINNER,
  TXT_BMI,
  TXT_ERROR
};
