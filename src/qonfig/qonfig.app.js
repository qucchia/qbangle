let qmenu = require("qmenu").init("qonfig.menu");
qmenu.setPath("home");

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

