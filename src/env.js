function env() {
  let env = {
    rootdir: __dirname,
  };
  global.env = env;
  return env;
}

module.exports = env();
