import { settingsStorage } from "settings";

import { getDateString } from "../common/utils.js";
import { debug } from "../common/log.js";

import Fitbit from "Fitbit";
import { sendVal } from "communication";

const fetchAndSendWeightToday = () => {
  const fitbit = getFitbitInstance();

  if (!fitbit) {
    return;
  }

  fitbit.getWeightToday().then(data => {
    if (!data) {
      return;
    }

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
};

const fetchAndSendLastEntry = () => {
  const fitbit = getFitbitInstance();

  if (!fitbit) {
    return;
  }

  fitbit.getLastEntry().then(lastEntry => {
    if (lastEntry) {
      sendVal({
        key: "LATEST_ENTRY",
        value: lastEntry.weight
      });
    }
  });
};

const getFitbitInstance = () => {
  const oauthData = settingsStorage.getItem("oauth");
  const unitData = settingsStorage.getItem("unit");

  if (unitData) {
    const unit = JSON.parse(unitData).values[0].name;
  } else {
    debug("No unit found");
    const unit = null;
  }

  if (!oauthData) {
    debug("No Oauth data found");
    return null;
  }

  const oauthDataParsed = JSON.parse(oauthData);
  return new Fitbit(oauthDataParsed, unit);
};

const sendUnitDataToApp = () => {
  const unitSettings = settingsStorage.getItem("unit");

  if (unitSettings) {
    const unit = JSON.parse(unitSettings).values[0].name;
  } else {
    debug("No unit set in settings, setting kg as default");

    const newSettingsObject = {
      selected: [0],
      values: [
        {
          name: "kg"
        }
      ]
    };

    settingsStorage.setItem("unit", JSON.stringify(newSettingsObject));

    const unit = newSettingsObject.values[0].name;
  }

  sendVal({
    key: "UNIT",
    value: unit
  });
};

const postWeightTodayAndSendResponseToApp = weightToday => {
  const fitbit = getFitbitInstance();

  fitbit.postWeightToday(weightToday).then(jsonData => {
    const entry = jsonData.weightLog;

    sendVal({
      key: "WEIGHT_TODAY",
      date: entry.date,
      value: entry.weight,
      bmi: entry.bmi
    });
  });
};

export {
  getFitbitInstance,
  sendUnitDataToApp,
  fetchAndSendLastEntry,
  fetchAndSendWeightToday,
  postWeightTodayAndSendResponseToApp
};
