const configApp = require("../config/config");
const configVersion = require("../core/configVersion");
const webRenderer = require("../core/webRenderer");
const webHelper = require("../core/webHelper");
const wrapperReadfile = require("../core/wrapperReadfile");
const injectionlinks = require("../injection/links");
const injectioncontacts = require("../injection/contacts");
const injectionlanguage = require("../injection/language");
const injectionlayout = require("../injection/layout");
const { IPHelper } = require("../helper/IP.helper");
const { LocationHelper } = require("../helper/location.helper");
const { fetchIP2City } = require("../API/IP2City.api");

const languageSupported = configApp.App.LanguageSupported.split("|").filter(
  (x) => x != ""
);

const langDesc = {
  "en-US": "English",
  "id-ID": "Bahasa",
};

const langMap = {
  "en-US": {
    title: "Alternative Link",
    copyButtonText: "Copy URL",
    mainTitle: "Help Center",
    spanTitle: "Need Help?",
    contactUs: "Contact Us",
    liveChat: "Live Chat",
    medsosTitle: "Our Social Media",
    bottomCopyRight: "Copyright",
    copyrightProtected: "All Right Reserved.",
    version: "Version",
  },
  "id-ID": {
    title: "Link Alternatif",
    copyButtonText: "Salin URL",
    mainTitle: "Pusat Bantuan",
    spanTitle: "Butuh Bantuan?",
    contactUs: "Hubungi Kami",
    liveChat: "Obrolan Langsung",
    medsosTitle: "Media Sosial Kami",
    bottomCopyRight: "Hak Cipta",
    copyrightProtected: "Hak cipta dilindungi.",
    version: "Versi",
  },
  "ja-JP": {
    title: "代替リンク",
    copyButtonText: "URLをコピー",
    mainTitle: "ヘルプセンター",
    spanTitle: "ヘルプが必要ですか？",
    contactUs: "お問い合わせ",
    liveChat: "ライブチャット",
    medsosTitle: "当社のソーシャルメディア",
    bottomCopyRight: "著作権",
    copyrightProtected: "無断転載禁止。",
    version: "バージョン",
  },
  "km-KH": {
    title: "តំណភ្ជាប់ជំនួស",
    copyButtonText: "ចម្លង URL",
    mainTitle: "មជ្ឈមណ្ឌលជំនួស",
    spanTitle: "ត្រូវការជំនួស?",
    contactUs: "ទាក់ទងមកយើង",
    liveChat: "ជជែកផ្ទាល់",
    medsosTitle: "មេដឹនសង្គមរបស់យើង",
    bottomCopyRight: "ការគ្រប់គ្រងរូបភាព",
    copyrightProtected: "រក្សា​សិទ្ធ​គ្រប់យ៉ាង។",
    version: "កំណែ",
  },
  "ko-KR": {
    title: "대체 링크",
    copyButtonText: "URL 복사",
    mainTitle: "도움말 센터",
    spanTitle: "도움이 필요하세요?",
    contactUs: "문의하기",
    liveChat: "라이브 채팅",
    medsosTitle: "우리의 소셜 미디어",
    bottomCopyRight: "저작권",
    copyrightProtected: "모든 권리 보유.",
    version: "버전",
  },
  "th-TH": {
    title: "ลิงค์ทางเลือก",
    copyButtonText: "คัดลอก URL",
    mainTitle: "ศูนย์ช่วยเหลือ",
    spanTitle: "ต้องการความช่วยเหลือ?",
    contactUs: "ติดต่อเรา",
    liveChat: "แชทสด",
    medsosTitle: "โซเชียลมีเดียของเรา",
    bottomCopyRight: "ลิขสิทธิ์",
    copyrightProtected: "สงวนลิขสิทธิ์.",
    version: "เวอร์ชัน",
  },
  "vi-VN": {
    title: "Liên kết thay thế",
    copyButtonText: "Sao chép URL",
    mainTitle: "Trung tâm trợ giúp",
    spanTitle: "Cần trợ giúp?",
    contactUs: "Liên hệ chúng tôi",
    liveChat: "Trò chuyện trực tiếp",
    medsosTitle: "Mạng xã hội của chúng tôi",
    bottomCopyRight: "Bản quyền",
    copyrightProtected: "Tất cả các quyền.",
    version: "Phiên bản",
  },
  "zh-CN": {
    title: "替代链接",
    copyButtonText: "复制URL",
    mainTitle: "帮助中心",
    spanTitle: "需要帮助吗？",
    contactUs: "联系我们",
    liveChat: "在线聊天",
    medsosTitle: "我们的社交媒体",
    bottomCopyRight: "版权",
    copyrightProtected: "保留所有权利。",
    version: "版本",
  },
  "zh-TW": {
    title: "替代連結",
    copyButtonText: "複製URL",
    mainTitle: "幫助中心",
    spanTitle: "需要幫助嗎？",
    contactUs: "聯繫我們",
    liveChat: "線上聊天",
    medsosTitle: "我們的社交媒體",
    bottomCopyRight: "版權",
    copyrightProtected: "保留所有權利。",
    version: "版本",
  },
};

async function getLanguage(location) {
  let defaultLanguage = configApp.App.LanguageDefault;
  let language = defaultLanguage;
  if (location && location.CountryShort) {
    switch (location.CountryShort) {
      case "US":
        language = "en-US";
        break;
      case "ID":
        language = "id-ID";
        break;
      case "JP":
        language = "ja-JP";
        break;
      case "KH":
        language = "km-KH";
        break;
      case "KR":
        language = "ko-KR";
        break;
      case "TH":
        language = "th-TH";
        break;
      case "VN":
        language = "vi-VN";
        break;
      case "CN":
        language = "zh-CN";
        break;
      case "TW":
        language = "zh-TW";
        break;
      default:
        language = defaultLanguage;
    }
  }

  if (!languageSupported.includes(language)) {
    language = defaultLanguage;
  }
  return language;
}

async function getLangMap(language) {
  return langMap[language];
}

async function routes(fastify) {
  for (const lang of languageSupported) {
    fastify.get(`/${lang}`, async (req, res) => {
      let language = await getLangMap(lang);
      let templaterender = await wrapperReadfile(
        `/views/${configApp.App.View}/index.html`
      );

      let layoutrender = "";
      let layoutobj = await injectionlayout(language);
      let layoutejs = "/ejs/layout.ejs";
      if (layoutejs) {
        layoutrender = await webRenderer.compile(layoutobj.layout, layoutejs);
      }

      let languagerender = "";
      let languageobj = await injectionlanguage(langDesc, lang);
      let languageejs = "/ejs/language.ejs";
      if (languageejs) {
        languagerender = await webRenderer.compile(languageobj, languageejs);
      }

      let data = {
        replaceLanguage: languagerender,
        replaceLayout: layoutrender,
      };

      let stream = await webRenderer.renderContent(data, templaterender);
      return res.type("text/html").send(stream);
    });
  }

  fastify.get("/", async (req, res) => {
    let ip = IPHelper.getIP(req);
    let location = await LocationHelper.getLocation(req, ip);
    let lang = await getLanguage(location);
    const redirectPath = `/${lang}`;
    return res.redirect(302, redirectPath);
  });

  fastify.get("/gethelpcenterappoperatorversion", async (req, res) => {
    let HelpCenterAppVersion = await webHelper.getAPPHelpCenterOprVersion();

    res.header("Access-Control-Allow-Origin", "*");
    return res.type("application/json").send(HelpCenterAppVersion);
  });
  fastify.get("/sitemap.xml", async (req, res) => {
    let templaterender = await wrapperReadfile(
      `/views/${configApp.App.View}/sitemap.xml`
    );
    let CurrentDate = await webHelper.getServerTime();

    let data = {
      currentdate: CurrentDate.toISOString(),
    };

    let stream = await webRenderer.renderContent(data, templaterender);
    return res.type("text/xml").send(stream);
  });
  fastify.get("/robots.txt", async (req, res) => {
    let templaterender = await wrapperReadfile(
      `/views/${configApp.App.View}/robots.txt`
    );

    let data = {};

    let stream = await webRenderer.renderContent(data, templaterender, 0);
    return res.send(stream);
  });
  fastify.get("/healthz", async (req, res) => {
    return res.send("ok");
  });
}

module.exports = routes;
