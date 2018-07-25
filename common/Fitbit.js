import { debug, error } from "../common/log.js";
import { getDateString } from "../common/utils.js";
import secrets from "../secrets.json";
import { b64EncodeUnicode } from "../common/base64.js";

const URL_BASE = "https://api.fitbit.com/1";
const LOGGED_IN_USER = "-";
const WEIGHT_URL = `${URL_BASE}/user/${LOGGED_IN_USER}/body/log/weight`;

class Fitbit {
  constructor(oauthData) {
    this.oauthData = oauthData;
  }

  getWeightToday() {
    return this.getWeight(new Date());
  }

  getWeight(date) {
    return this.getUrl(`${WEIGHT_URL}/date/${getDateString(date)}.json`);
  }

  getUrl(url) {
    debug(`Getting URL: ${url}`);

    return fetch(url, {
      headers: {
        Authorization: `${this.oauthData.token_type} ${
          this.oauthData.access_token
        }`
      }
    })
      .then(response => response.json())
      .then(jsonData => {
        debug(`Response: ${JSON.stringify(jsonData, undefined, 2)}`);
        return jsonData;
      })
      .catch(err => {
        error(err);
        const jsonData = err.json();

        if (err.status === 401) {
          jsonData.errors.forEach(element => {
            if (element.errorType === "expired_token") {
              debug("Token expired - refreshing");

              this.refreshTokens().then(data => {
                debug("Token refreshed");
              });
            }
          });
        }
      });
  }

  refreshTokens() {
    const url = secrets.oauth.tokenRequestUrl;
    const username = secrets.oauth.clientId;
    const password = secrets.oauth.clientSecret;
    const b64Auth = "Basic " + b64EncodeUnicode(`${username}:${password}`);

    debug("Refresh Oauth token");

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: b64Auth
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: this.oauthData.refresh_token
      })
    })
      .then(response => response.json())
      .then(jsonData => {
        debug(
          `Refresh tokens response: ${JSON.stringify(jsonData, undefined, 2)}`
        );
        this.oauthData = jsonData;
      });
  }
}

export default Fitbit;
