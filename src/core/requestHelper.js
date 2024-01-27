const http = require("http");
const https = require("https");
const zlib = require("zlib");

function requestHelper() {
  async function fetch(url, options) {
    return await __fetch(url, options);
  }

  async function fetch__noContentRes(url, options) {
    return await __fetch(url, options);
  }

  async function __fetch(url, options) {
    options.timeout = options.timeout || 30000;
    options.method = options.method || "POST";
    if (!options.headers) options.headers = {};
    options.headers["Accept-Encoding"] = "gzip";

    let data = { ...options.data } || {};

    const startTime = Date.now();
    data.OperatorID = data.OperatorID;
    data.CompanyID = data.CompanyID;
    if (options.method === "GET") {
      data = null;
    }

    const dataLog = {
      url,
      module: "fetch",
      caller: options.caller,
      input: data,
      stamp_user: data.StampUser || "",
      ...options.optionalLog,
      method: options.method,
    };

    try {
      const res = await request(url, options, data);
      const result = JSON.parse(res);

      return result;
    } catch (ex) {
      return { ResultCode: 99, ErrorMessage: UNKNOWN_ERROR };
    }
  }

  function request(url, options, data) {
    return new Promise((resolve, reject) => {
      let result = [];

      function onData(chunk) {
        result.push(chunk);
      }

      function onError(err) {
        reject(err);
      }

      function onEnd() {
        resolve(Buffer.concat(result).toString());
      }

      if (!options.headers) options.headers = {};
      options.headers["Connection"] = "keep-alive";

      if (data) {
        data = JSON.stringify(data) || "";
        options.headers["Content-Type"] = "application/json";
        // options.headers['Content-Length'] = data.length
      }

      let protocol = /^https/.test(url) ? https : http;
      let req = protocol.request(url, options, (res) => {
        let encoding = res.headers ? res.headers["content-encoding"] : null;
        if (encoding && encoding.indexOf("gzip") >= 0) {
          let gunzip = zlib.createGunzip();
          res.pipe(gunzip);

          gunzip.on("data", onData);
          gunzip.on("end", onEnd);
          gunzip.on("error", onError);
        } else {
          res.on("data", onData);
          res.on("end", onEnd);
        }
      });

      req.on("timeout", () => {
        // on error socket hang up
        req.abort();
      });

      req.on("error", onError);

      data && req.write(data);
      req.end();
    });
  }

  return { fetch, fetch__noContentRes };
}

exports.RequestHelper = requestHelper();
