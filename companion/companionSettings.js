import { settingsStorage } from "settings";

import { debug } from "../common/log.js";
import Fitbit from "Fitbit";
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

    fitbit.getLastEntry().then(lastEntry => {
      if (lastEntry) {
        sendVal({
          key: "LATEST_ENTRY",
          value: lastEntry.weight
        });
      }
    });

    fitbit.getWeightToday().then(data => {
      if (data.weight.length >= 1) {
        const entry = data.weight[0];

        sendVal({
          key: "WEIGHT_TODAY",
          date: entry.date,
          value: entry.weight,
          bmi: entry.bmi
        });
      } else {
        sendVal({
          key: "WEIGHT_TODAY",
          date: getDateString(new Date()),
          value: null,
          bmi: null
        });
      }
    });
  }
};

const updateOauthSettings = oauthData => {
  settingsStorage.setItem("oauth", JSON.stringify(oauthData));
  debug(`Wrote new Oauth data to settings`);
};

export { initSettings, restoreSettings, updateOauthSettings };
