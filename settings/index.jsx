import { debug } from "../common/log.js";

import secrets from "../secrets.json";

const generateSettings = props => (
  <Page>
    <Section title={<Text>Log in with your Fitbit account</Text>}>
      <Oauth
        settingsKey="oauth"
        title="Login"
        label="Fitbit"
        status={(() => {
          if (props.settingsStorage.getItem("oauth")) {
            return "Authenticated";
          } else {
            return "Not authenticated";
          }
        })()}
        authorizeUrl={secrets.oauth.authorizationUrl}
        requestTokenUrl={secrets.oauth.tokenRequestUrl}
        clientId={secrets.oauth.clientId}
        clientSecret={secrets.oauth.clientSecret}
        scope="weight"
        onAccessToken={async data => {
          console.log(data);
        }}
      />
    </Section>
  </Page>
);

registerSettingsPage(generateSettings);
