const configApp = require("../core/configApp");

async function language(langDesc, selectedLanguage) {
  let obj = {};
  let supportedLanguage = configApp.App.LanguageSupported.split("|").filter(
    (x) => x != "" && x != selectedLanguage
  );

  try {
    obj.data = { langDesc, selectedLanguage, supportedLanguage };
    return obj;
  } catch (error) {
    console.error(error);
    return obj;
  }
}

module.exports = language;
