import { getDateString, addDays } from "../common/utils.js";
import { debug } from "../common/log.js";

import { sendVal } from "communication";
import { writeLocalStorage } from "localStorage";

const requestLatestEntryIfNoneExists = localStorage => {
  const dateToday = new Date();

  if (localStorage.today && localStorage.today.value) {
    if (
      localStorage.latestEntry &&
      localStorage.latestEntry.date === localStorage.today.date
    ) {
      return;
    }

    debug(
      `Weight found for ${localStorage.today.date}, using ${
        localStorage.today.value
      } as latest entry`
    );
    saveLatestEntry(localStorage.today.date, localStorage.today.value);
    return;
  }

  if (
    localStorage.latestEntry &&
    getDateString(addDays(dateToday, -1)) === localStorage.latestEntry.date
  ) {
    return;
  }

  sendVal({
    key: "REQUEST_LATEST_ENTRY"
  });
};

const wipeTodayIfNewDay = localStorage => {
  const dateToday = new Date();
  const dateStringToday = getDateString(dateToday);

  if (localStorage.today) {
    if (dateStringToday != localStorage.today.date) {
      writeLocalStorage("today", {
        bmi: null,
        value: null,
        date: dateStringToday
      });
    }
  }
};

const saveLatestEntry = (date, value) => {
  writeLocalStorage("latestEntry", {
    date: date,
    value: value
  });
};

export { requestLatestEntryIfNoneExists, saveLatestEntry, wipeTodayIfNewDay };
