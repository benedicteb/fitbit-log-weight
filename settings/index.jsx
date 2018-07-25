import { debug } from "../common/log.js";

import secrets from "../secrets.json";

const generateSettings = () => (
  <Page>
    <Section title={<Text>Log in with your Fitbit account</Text>}>
      <Oauth
        settingsKey="oauth"
        title="Login"
        label="Fitbit"
        status="Login"
        authorizeUrl={secrets.oauth.authorizationUrl}
        requestTokenUrl={secrets.oauth.tokenRequestUrl}
        clientId={secrets.oauth.clientId}
        clientSecret={secrets.oauth.clientSecret}
        scope="weight"
        onAccessToken={async (data) => {
          console.log(data);
        }}
      />
    </Section>
  </Page>
);

registerSettingsPage(generateSettings);