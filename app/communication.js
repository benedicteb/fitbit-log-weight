import * as messaging from "messaging";

import { debug } from "../common/log.js";
import { writeLocalStorage } from "localStorage";
import { drawTodayScreen } from "draw";

const initMessaging = () => {
  // Message is received
  messaging.peerSocket.onmessage = evt => {
    debug(`App received: ${JSON.stringify(evt, undefined, 2)}`);
    
    if (evt.data.key === "WEIGHT_TODAY") {
      writeLocalStorage("today", {
        date: evt.data.date,
        value: evt.data.value
      });
      drawTodayScreen();
    }
  };

  // Message socket opens
  messaging.peerSocket.onopen = () => {
    debug("App Socket Open");
  };

  // Message socket closes
  messaging.peerSocket.onclose = () => {
    debug("App Socket Closed");
  };

  // Problem with message socket
  messaging.peerSocket.onerror = err => {
    error("Connection error: " + err.code + " - " + err.message);
  };
};

export { initMessaging };