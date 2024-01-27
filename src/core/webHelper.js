const configApp = require("./configApp");
const log = require("./webLog");
const redis = require("./wrapperRedis");

function webHelper() {
  var obj = {};

  obj.RedisInstanceKeyDefault = "Default";
  obj.RedisInstanceKeyConfig = "Config";
  obj.getAPPVersion = async function () {
    let callerinfo = {
      function_name: "webHelper.getAPPVersion",
    };
    let result = "1.0.0";
    try {
      let appversion = await obj.getRedis(
        obj.RedisInstanceKeyDefault,
        "appversion"
      );
      if (appversion) {
        result = appversion;
      }
    } catch (ex) {
      log.exLogging(callerinfo, ex);
    }
    return result;
  };
  obj.getAPPOperatorVersion = async function (CompanyID, OperatorID) {
    let callerinfo = {
      function_name: "webHelper.getAPPOperatorVersion",
    };
    let result = "";
    try {
      let appoperatorversionkey = obj.getWrapperKey4Redis(
        `appoperatorversion:${CompanyID}:${OperatorID}`
      );
      let appoperatorversion = await obj.getRedis(
        obj.RedisInstanceKeyDefault,
        appoperatorversionkey
      );
      if (appoperatorversion) {
        result = appoperatorversion;
      }
    } catch (ex) {
      log.exLogging(callerinfo, ex);
    }
    return result;
  };
  obj.getAPPDownloadURL = async function (CompanyID, OperatorID) {
    let callerinfo = {
      function_name: "webHelper.getAPPDownloadURL",
    };
    let result = "1.0.0";
    try {
      let appdownloadurlkey = obj.getWrapperKey4Redis(
        `appdownloadurl:${CompanyID}:${OperatorID}`
      );
      let appdownloadurl = await obj.getRedis(
        obj.RedisInstanceKeyDefault,
        appdownloadurlkey
      );
      if (appdownloadurl) {
        result = appdownloadurl;
      }
    } catch (ex) {
      log.exLogging(callerinfo, ex);
    }
    return result;
  };
  obj.getBackupDomain = async function (CompanyID, OperatorID) {
    let callerinfo = {
      function_name: "webHelper.getBackupDomain",
    };
    let result = "";
    try {
      let backupDomainSettingRedisKey = obj.getWrapperKey4Redis(
        `backupdomainsetting:${CompanyID}:${OperatorID}`
      );
      let links = await obj.getRedis(
        obj.RedisInstanceKeyDefault,
        backupDomainSettingRedisKey
      );
      let backupDomainSettingRedisKey2 = obj.getWrapperKey4Redis(
        `backupdomainsetting2:${CompanyID}:${OperatorID}`
      );
      let links2 = await obj.getRedis(
        obj.RedisInstanceKeyDefault,
        backupDomainSettingRedisKey2
      );
      if (links || links2) {
        let linksDataObj = { domains: [] };
        if (links) {
          let linksObj = JSON.parse(links);
          linksObj.domains = linksObj.domains.filter((d) => !d.isapk);
          linksObj.domains = linksObj.domains.map((d) => d.url);
          linksDataObj.domains = linksDataObj.domains.concat(linksObj.domains);
        }
        if (links2) {
          let linksObj2 = JSON.parse(links2);
          linksObj2.domains = linksObj2.domains.filter((d) => !d.isapk);
          linksObj2.domains = linksObj2.domains.map((d) => d.url);
          linksDataObj.domains = linksDataObj.domains.concat(linksObj2.domains);
        }
        if (linksDataObj.domains && linksDataObj.domains.length) {
          result = linksDataObj.domains;
        }
      }
    } catch (ex) {
      log.exLogging(callerinfo, ex);
    }
    return result;
  };
  obj.getHelpCenterWebVersion = async function () {
    let callerinfo = {
      function_name: "webHelper.getHelpCenterWebVersion",
    };
    let result = "";
    try {
      let hcwebversion = await obj.getRedis(
        obj.RedisInstanceKeyDefault,
        "helpcenterwebversion"
      );
      if (hcwebversion) {
        result = hcwebversion;
      }
    } catch (ex) {
      log.exLogging(callerinfo, ex);
    }
    return result;
  };
  obj.getAPPHelpCenterDownloadURL = async function (CompanyID, OperatorID) {
    let callerinfo = {
      function_name: "webHelper.getAPPHelpCenterDownloadURL",
    };
    let result = "";
    try {
      let hcdownloadurlkey = obj.getWrapperKey4Redis(
        `helpcenterdownloadurl:${CompanyID}:${OperatorID}`
      );
      let hcdownloadurl = await obj.getRedis(
        obj.RedisInstanceKeyDefault,
        hcdownloadurlkey
      );
      if (hcdownloadurl) {
        result = hcdownloadurl;
      }
    } catch (ex) {
      log.exLogging(callerinfo, ex);
    }
    return result;
  };
  obj.getAPPHelpCenterOprVersion = async () => {
    let callerinfo = {
      function_name: "webHelper.getAPPHelpCenterOprVersion",
    };
    let result = "";
    try {
      let oprappversionrediskey = obj.getWrapperKey4Redis(
        `helpcenteroperatorversion:${configApp.App.CompanyID}:${configApp.App.OperatorID}`
      );
      let oprappversion = await obj.getRedis(
        obj.RedisInstanceKeyDefault,
        oprappversionrediskey
      );

      if (oprappversion) {
        result = oprappversion;
      }
    } catch (ex) {
      log.exLogging(callerinfo, ex);
    }
    return result;
  };
  obj.getServerTime = async function () {
    let callerinfo = {
      function_name: "webHelper.getServerTime",
    };
    let result = null;

    let date = await obj.getRedis(
      obj.RedisInstanceKeyDefault,
      "DatabaseServerDateTime"
    );
    try {
      if (date) {
        date = JSON.parse(date);
        if (date && date.ResultCode == 1) {
          result = new Date(date.Content.Data.DateTime);
        }
      }
    } catch (ex) {
      log.exLogging(callerinfo, ex);
    }
    if (result == null) {
      result = new Date();
      result.setMilliseconds(0);
      let utc = result.getTime() + result.getTimezoneOffset() * 60000;
      result = new Date(utc + 3600000 * 8); // gmt+8
    }
    return result;
  };
  obj.getCompOprConfig = function extendRedis(CompOpr) {
    return configApp.Operators[CompOpr];
  };
  obj.getWrapperKey4Redis = function (key) {
    return key.toLowerCase();
  };
  obj.setRedis = function setRedis(redisClientKey, key, value, ex) {
    if (key) {
      redis.set(redisClientKey, key, value, ex);
    }
  };
  obj.getRedis = async function getRedis(redisClientKey, key) {
    if (key) {
      let result = await redis.get(redisClientKey, key);
      return result;
    }
    return "";
  };
  obj.delRedis = function delRedis(redisClientKey, key) {
    if (key) {
      redis.del(redisClientKey, key);
    }
  };
  obj.extendRedis = function extendRedis(redisClientKey, key, ex) {
    if (key) {
      redis.extendexpiry(redisClientKey, key, ex);
    }
  };
  obj.getClientIPFull = function (req) {
    var ip =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      (req.connection && req.connection.remoteAddress
        ? req.connection.remoteAddress
        : "") ||
      (req.socket && req.socket.remoteAddress
        ? req.socket.remoteAddress
        : "") ||
      (req.connection &&
      req.connection.socket &&
      req.connection.socket.remoteAddress
        ? req.connection.socket.remoteAddress
        : "") ||
      "";
    return ip;
  };
  obj.getClientIP = function (req) {
    const localIpRegexp = new RegExp(
      /(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/
    );
    var ip = obj.getClientIPFull(req).split(",");

    var filteredIP = ip.filter((el) => !localIpRegexp.test(el));
    if (filteredIP.length == 0) {
      ip = ip[ip.length - 1].trim();
    } else {
      ip = filteredIP[0];
    }
    return ip;
  };

  return obj;
}

module.exports = webHelper();
