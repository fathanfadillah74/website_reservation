module.exports = {
  App: {
    AppID: process.env.APPID || "website-reservation",
    Port: process.env.PORT || 10777,
    LanguageDefault: process.env.LANGUAGE_DEFAULT || "id-ID",
    LanguageSupported: process.env.LANGUAGE_SUPPORTED || "|id-ID|en-US|",
    View: "hotel",
  },
};
