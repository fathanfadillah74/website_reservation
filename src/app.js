const path = require("path");
const fastifystatic = require("@fastify/static");
const env = require("./env");
const configApp = require("./core/configApp");
const routes = require("./routes/routes.js");

const fastify = require("fastify")({ logger: true });

function app() {
  const rootdir = env.rootdir;
  let obj = {};
  obj.main = async function () {
    fastify.register(fastifystatic, {
      root: path.join(rootdir, "public"),
      prefix: "/",
      maxAge: 31557600000,
    });

    fastify.register(routes);

    const start = async () => {
      try {
        let port = configApp.App.Port;
        console.log(`Server is now listening on ${port}`);
        await fastify.listen({ port: port, host: "0.0.0.0" });
      } catch (err) {
        console.warn(err);
        process.exit(1);
      }
    };
    await start();
  };

  return obj;
}

module.exports = app();
