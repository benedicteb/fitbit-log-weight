import { initMessaging } from "communication";
import { drawTodayScreen, startSpinner } from "draw";
import { initListeners } from "eventListeners";
import { getLocalStorage } from "localStorage";
import { requestLatestEntryIfNoneExists, wipeTodayIfNewDay } from "data";

const localStorageAtBoot = getLocalStorage();

initMessaging();
initListeners();

wipeTodayIfNewDay(localStorageAtBoot);
requestLatestEntryIfNoneExists(localStorageAtBoot);

drawTodayScreen();
startSpinner();
