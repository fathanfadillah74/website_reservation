const eta = require("eta");
eta.configure({
  cache: true,
  useWith: true,
});
const wrapperReadfile = require("./wrapperReadfile");
const log = require("./webLog");

function sprintf(src, data) {
  Object.keys(data).forEach(function (key) {
    var r = new RegExp("{" + key + "}", "g");
    src = src.replace(r, data[key]);
  });
  return src;
}

async function compile(data, templatefile) {
  let callerinfo = {
    function_name: "compile",
    data_param: data,
    templatefile_param: templatefile,
  };
  var result = "";
  try {
    if (templatefile) {
      var source = await wrapperReadfile(templatefile);
      result = eta.render(source, data);
    } else {
      result = data;
    }
  } catch (ex) {
    log.exLogging(callerinfo, ex);
  }
  return result;
}

function webRenderer() {
  let callerinfo = {
    function_name: "webRenderer",
  };
  var obj = {};
  obj.renderContent = async function renderContent(data, content, istrim = 1) {
    let result = "";
    try {
      result = sprintf(content, data);
      if (istrim) result = result.replace(/\s+/g, " ").trim();
    } catch (ex) {
      callerinfo.function_name_sub = ".renderContent." + JSON.stringify(data);
      log.exLogging(callerinfo, ex);
    }
    return result;
  };
  obj.compile = async function (data, templatefile) {
    return compile(data, templatefile);
  };
  return obj;
}

module.exports = webRenderer();
