import { settingsStorage } from "settings";

import { debug } from "../common/log.js";

import {
  sendUnitDataToApp,
  fetchAndSendWeightToday,
  fetchAndSendLastEntry
} from "data";

const initSettings = () => {
  // A user changes settings
  settingsStorage.onchange = evt => {
    debug(`Settings changed: ${JSON.stringify(evt, undefined, 2)}`);

    if (evt.key === "oauth") {
      fetchAndSendWeightToday();
      fetchAndSendLastEntry();
    } else if (evt.key === "unit") {
      if (!evt.oldValue) {
        sendUnitDataToApp();
        fetchAndSendWeightToday();
        return;
      }

      const oldValue = JSON.parse(evt.oldValue).values[0].name;
      const newValue = JSON.parse(evt.newValue).values[0].name;

      if (!oldValue || newValue != oldValue) {
        sendUnitDataToApp();
        fetchAndSendWeightToday();
      }
    }
  };
};

const updateOauthSettings = oauthData => {
  settingsStorage.setItem("oauth", JSON.stringify(oauthData));
  debug(`Wrote new Oauth data to settings`);
};

export { initSettings, restoreSettings, updateOauthSettings };
