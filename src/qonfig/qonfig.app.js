let config = require("Storage").readJSON("config.json");

let qmenu = require("qmenu").init("qonfig.menu");
qmenu.setPath("home");

// Converts settings to official Settings app format and writes them
function convertToBangleSettings() {
  let setting = {};
  setting.theme = {
    fg: config.system.theme.foreground,
    bg: config.system.theme.background,
    fg2: config.system.theme.foreground2,
    bg2: config.system.theme.background2,
    fgH: config.system.theme.fgHighlight,
    bgH: config.system.theme.bgHighlight,
    dark: config.system.theme.dark,
  };

  print(setting);
  require("Storage").write("setting.json", setting);
}

qmenu.getDynamicMenu = (path) => {
  if (path === "apps") {
    let items = require("Storage").list(/.app.menu$/).map((file) => {
      let appId = file.substr(0, file.length - 9);
      return {
        title: require("Storage").readJSON(appId + ".info").name,
        type: "menu",
        id: "apps/" + appId + "/home",
      };
    }); 

    return {
      title: "Apps",
      type: "UpDown",
      items: items,
    };
  } else if (path.startsWith("apps/")) {
    let pathSplit = path.split("/");
    let appId = pathSplit[1];
    let subPath = pathSplit.slice(2).join("/");

    return read("Storage").readJSON(appId + ".app.menu")[subPath];
  } 
};

qmenu.set = (prop, value) => {
  let c = config;
  let propArray = prop.split(".");

  propArray.slice(0, propArray.length - 1).forEach((p) => {
    c = c[p];
  });

  c[propArray[propArray.length - 1]] = value;

  print(config);

  if (prop === "system.themePreset") {
    config.system.theme = require("Storage").readJSON("themes.json")[value];
    g.theme = th;
    settings.theme = th;
    updateSettings();
    delete g.reset;
    g._reset = g.reset;
    g.reset = function(n) { return g._reset().setColor(th.fg).setBgColor(th.bg); };
    g.clear = function(n) { if (n) g.reset(); return g.clearRect(0,0,g.getWidth(),g.getHeight()); };
    g.clear(1);
    Bangle.drawWidgets();
  }

  require("Storage").write("config.json", config);
  convertToBangleSettings();
};

