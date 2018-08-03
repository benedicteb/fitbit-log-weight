import { initMessaging } from "communication";
import { drawTodayScreen, startSpinner } from "draw";
import { initListeners } from "eventListeners";
import { readLocalStorage } from "localStorage";
import { requestLatestEntryIfNoneExists, wipeTodayIfNewDay } from "data";

const localStorage = readLocalStorage();

initMessaging(localStorage);
initListeners(localStorage);

wipeTodayIfNewDay(localStorage);
requestLatestEntryIfNoneExists(localStorage);

drawTodayScreen(localStorage);
startSpinner();
