import document from "document";

import { getLocalStorage } from "localStorage";

const DATE = document.getElementById("date");
const STATUS_MESSAGE = document.getElementById("status-message");
const WEIGHT_LOGGED = document.getElementById("weight-logged");

const drawTodayScreen = () => {
  const localStorage = getLocalStorage();

  if (localStorage.today) {
    const today = localStorage.today;

    DATE.text = today.date;

    if (!today.value) {
      STATUS_MESSAGE.text = "No entry today";
      WEIGHT_LOGGED.text = "";
    } else {
      WEIGHT_LOGGED.text = `${today.value} kg`;
      STATUS_MESSAGE.text = "";
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
        STATUS_MESSAGE.text = "Error fetching data. Try restarting app";
      }
    }, 5 * 1000);
  }
};

export { drawTodayScreen };
