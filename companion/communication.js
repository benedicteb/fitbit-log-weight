import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { debug, error } from "../common/log.js";

import {
  sendUnitDataToApp,
  fetchAndSendWeightToday,
  fetchAndSendLastEntry,
  postWeightTodayAndSendResponseToApp
} from "data";
import Fitbit from "Fitbit";

const initMessaging = () => {
  // Message socket opens
  messaging.peerSocket.onopen = () => {
    debug("Companion Socket Open");
    onPeerSocketOpen();
  };

  // Message socket closes
  messaging.peerSocket.onclose = () => {
    debug("Companion Socket Closed");
  };

  // Message is received
  messaging.peerSocket.onmessage = evt => {
    debug(`Companion received: ${JSON.stringify(evt, undefined, 2)}`);

    if (evt.data.key === "WEIGHT_LOGGED_TODAY") {
      postWeightTodayAndSendResponseToApp(evt.data.value);
    }
  };

  // Problem with message socket
  messaging.peerSocket.onerror = err => {
    error("Connection error: " + err.code + " - " + err.message);
  };
};

const onPeerSocketOpen = () => {
  sendUnitDataToApp();
  fetchAndSendWeightToday();
  fetchAndSendLastEntry();
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
