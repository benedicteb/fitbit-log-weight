import config from "config.json";

const debug = text => {
  if (config.debug) {
    console.log(text);
  }
};

const error = text => {
  console.error(text);
};

export { debug, error };
