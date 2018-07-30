import { debug, error } from "../common/log.js";
import { getDateString } from "../common/utils.js";
import secrets from "../secrets.json";
import { b64EncodeUnicode } from "../common/base64.js";

import { updateOauthSettings } from "companionSettings";
import { sendVal } from "communication";

const URL_BASE = "https://api.fitbit.com/1";
const LOGGED_IN_USER = "-";
const WEIGHT_URL = `${URL_BASE}/user/${LOGGED_IN_USER}/body/log/weight`;

const MAX_RETRIES = 3;

const sortEntriesByDate = entries => {
  const sortedEntries = entries.sort((a, b) => {
    return new Date(a.date);
  });

  return sortedEntries;
};

class Fitbit {
  constructor(oauthData) {
    this.oauthData = oauthData;
    this.retries = 0;
  }

  getWeightToday() {
    return this.getWeight(new Date());
  }

  getWeight(date) {
    return this.getUrl(`${WEIGHT_URL}/date/${getDateString(date)}.json`);
  }

  getLastThirtyDays() {
    return this.getUrl(
      `${WEIGHT_URL}/date/${getDateString(new Date())}/30d.json`
    );
  }

  getLastEntry() {
    return this.getLastThirtyDays().then(entriesLastThirtyDays => {
      if (!entriesLastThirtyDays) {
        return null;
      }

      const sortedEntries = sortEntriesByDate(entriesLastThirtyDays.weight);

      if (sortedEntries.length > 0) {
        return sortedEntries[0];
      }

      return null;
    });
  }

  postWeightToday(value) {
    return this.postWeight(new Date(), value);
  }

  postWeight(date, value) {
    const url = `${WEIGHT_URL}.json`;
    const body = `weight=${value}&date=${getDateString(date)}`;

    return this.postUrl(url, body);
  }

  getUrl(url) {
    return this.openUrl(url, "GET", null, "application/json");
  }

  postUrl(url, body) {
    return this.openUrl(url, "POST", body, "application/x-www-form-urlencoded");
  }

  openUrl(url, method, body, contentType) {
    debug(`${method} ${url} ${body}`);

    return fetch(url, {
      method: method,
      headers: {
        Authorization: `${this.oauthData.token_type} ${
          this.oauthData.access_token
        }`,
        "Content-Type": contentType
      },
      body: body
    })
      .then(response => {
        if (!response.ok) {
          debug(`Bad response: ${response.status}`);
        }

        return response.json().then(json => {
          return {
            status: response.status,
            body: json
          };
        });
      })
      .then(response => {
        debug(
          `Response: ${response.status} ${JSON.stringify(
            response.body,
            undefined,
            2
          )}`
        );

        if (response.status === 401) {
          for (const i = 0; i < response.body.errors.length; i++) {
            const element = response.body.errors[i];

            if (element.errorType === "expired_token") {
              debug("Token expired - refreshing");

              return this.refreshTokens().then(data => {
                debug("Token refreshed");

                if (this.retries < MAX_RETRIES) {
                  debug(
                    `Retrying original request, try ${this.retries +
                      1} out of ${MAX_RETRIES}`
                  );

                  this.retries++;

                  return this.getUrl(url);
                } else {
                  sendVal({
                    key: "ERROR",
                    message: "Too many retries"
                  });

                  return null;
                }
              });
            }
          }
        }

        if (response.status >= 400) {
          sendVal({
            key: "ERROR",
            message: `Error ${response.status} in response`
          });

          return null;
        }

        this.retries = 0;
        return response.body;
      })
      .catch(err => {
        error(err);
      });
  }

  refreshTokens() {
    const url = secrets.oauth.tokenRequestUrl;
    const username = secrets.oauth.clientId;
    const password = secrets.oauth.clientSecret;
    const b64Auth = "Basic " + b64EncodeUnicode(`${username}:${password}`);
    const refresh_token = this.oauthData.refresh_token;
    const formBody = `grant_type=refresh_token&refresh_token=${refresh_token}`;

    debug("Refresh Oauth token");

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: b64Auth
      },
      body: formBody
    })
      .then(response => {
        return response.json().then(json => {
          return {
            status: response.status,
            body: json
          };
        });
      })
      .then(response => {
        debug(
          `Refresh tokens response: ${response.status} ${JSON.stringify(
            response.body,
            undefined,
            2
          )}`
        );

        if (response.status === 200) {
          this.oauthData = response.body;
          updateOauthSettings(response.body);
          debug("New tokens saved in instance and settings");
        }

        return response;
      });
  }
}

export default Fitbit;
