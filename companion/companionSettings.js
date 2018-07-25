import { settingsStorage } from "settings";

import { debug } from "../common/log.js";
import Fitbit from "../common/Fitbit.js";
import { sendVal } from "communication";
import { getDateString } from "../common/utils.js";

const initSettings = () => {
  // A user changes settings
  settingsStorage.onchange = evt => {
    debug(`Settings changed: ${JSON.stringify(evt, undefined, 2)}`);

    if (evt.key === "oauth") {
      restoreSettings();
    }
  };
};

const restoreSettings = () => {
  const oauthData = settingsStorage.getItem("oauth");

  if (!oauthData) {
    debug("No Oauth data found");
  } else {
    const oauthDataParsed = JSON.parse(oauthData);
    const fitbit = new Fitbit(oauthDataParsed);

    fitbit.getWeightToday().then(data => {
      if (data.weight.length >= 1) {
        const entry = data.weight[0];

        sendVal({
          key: "WEIGHT_TODAY",
          date: entry.date,
          value: entry.weight
        });
      } else {
        sendVal({
          key: "WEIGHT_TODAY",
          date: getDateString(new Date()),
          value: null
        })
      }
    });
  }
};

export { initSettings, restoreSettings };
