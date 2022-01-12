let config = require("Storage").readJSON("config.json");

let qmenu = require("qmenu").init("qonfig.menu");
qmenu.setPath("home");

function writeConfig() {
  require("Storage").write("config.json", config);

  // Convert settings to official Settings app format
  let setting = require("Storage").readJSON("setting.json");
  setting.theme = config.system.theme;

  print(setting);
  require("Storage").write("setting.json", setting);
}

function updateTheme(theme) {
  g.theme = theme;
  delete g.reset;
  g._reset = g.reset;
  g.reset = function(n) {
    return g._reset().setColor(theme.fg).setBgColor(theme.bg);
  };
  g.clear = function(n) {
    if (n) g.reset();
    return g.clearRect(0,0,g.getWidth(),g.getHeight());
  };
  g.clear(1);
  qmenu.render();
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

  if (prop === "system.themePreset") {
    config.system.theme = require("Storage").readJSON("themes.json")[value];
    updateTheme(config.system.theme);
  } else if (prop.startsWith("system.theme")) {
    updateTheme(config.system.theme);
  } 

  print(config);

  writeConfig();
};

