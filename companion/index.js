import { debug } from "../common/log.js";
import { initMessaging, sendVal } from "communication";
import { initSettings } from "companionSettings";
import Fitbit from "../common/Fitbit.js";

initSettings();
initMessaging();
