import { initMessaging } from "communication";
import { drawTodayScreen, startSpinner } from "draw";
import { initListeners } from "eventListeners";

initMessaging();
drawTodayScreen();
startSpinner();
initListeners();
