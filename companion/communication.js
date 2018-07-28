import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { debug, error } from "../common/log.js";
import { restoreSettings } from "companionSettings";
import Fitbit from "Fitbit";

const initMessaging = () => {
  // Message socket opens
  messaging.peerSocket.onopen = () => {
    debug("Companion Socket Open");
    restoreSettings();
  };

  // Message socket closes
  messaging.peerSocket.onclose = () => {
    debug("Companion Socket Closed");
  };

  // Message is received
  messaging.peerSocket.onmessage = evt => {
    debug(`Companion received: ${JSON.stringify(evt, undefined, 2)}`);

    if (evt.data.key === "WEIGHT_LOGGED_TODAY") {
      const oauthData = settingsStorage.getItem("oauth");

      if (oauthData) {
        const oauthDataParsed = JSON.parse(oauthData);
        const fitbit = new Fitbit(oauthDataParsed);

        fitbit.postWeightToday(evt.data.value);
      }
    }
  };

  // Problem with message socket
  messaging.peerSocket.onerror = err => {
    error("Connection error: " + err.code + " - " + err.message);
  };
};

// Send data to device using Messaging API
const sendVal = data => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    try {
      messaging.peerSocket.send(data);
      debug(`Sent to app: ${JSON.stringify(data, undefined, 2)}`);
    } catch (err) {
      error(`Exception when sending to companion`);
    }
  } else {
    error("Unable to send data to app");
  }
};

export { sendVal, initMessaging };
