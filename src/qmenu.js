/*
 * Qmenu is a menu library which supports different types of menus and allows making
 * complex menus (with submenus and such) without having to worry about writing all
 * the code: you simply provide a JSON file with the menu data in it and Qmenu does
 * all the rest for you.
 */

let C = {
  HOR_MARGIN: 25,
  X: 25,
  Y: 50,
};

function qmenu(src) {
  this.src = src;
}

qmenu.prototype.render = function() {
  if (this.menu.type === "123") {
    g.clear();
    g.reset();
    g.setFont("6x8", 2);
    g.setFontAlign(0, 0);
    g.drawString("Launcher", 120, 20);
    this.drawOption("1", this.menu.items[0].title, 50, 45);
    this.drawOption("2", this.menu.items[1].title, 115, 45);
    this.drawOption("3", this.menu.items[2].title, 180, 45);
  } else if (this.menu.type === "UpDown") {
    let menu = {
      "": {
        title: this.menu.title,
      }
    };

    this.menu.items.forEach((item) => {
      if (item.type === "menu") {
        menu[item.title] = () => {
          this.setPath(item.id);
        };
      }
    });

    E.showMenu(menu);
  }
};

qmenu.prototype.setPath = function(path) {
  this.path = path;
  this.menu = require("Storage").readJSON(this.src)[path];
  this.render();

  if (this.menu.type === "UpDown") return;

  setWatch(() => {
    if (this.menu.type === "123") {
      this.handle123press(1);
    }
  }, BTN1, {
    repeat: true
  });

  setWatch(() => {
    if (this.menu.type === "123") {
      this.handle123press(2);
    }
  }, BTN2, {
    repeat: true
  });

  setWatch(() => {
    if (this.menu.type === "123") {
      this.handle123press(3);
    }
  }, BTN3, {
    repeat: true
  });
};

qmenu.prototype.drawOption = function(number, text, y, height) {
  g.
  // Rectangle
  drawRect(C.HOR_MARGIN, y, 240 - C.HOR_MARGIN, y + height)
    // Circle
    .setColor("#000")
    .fillCircle(C.HOR_MARGIN, y, 10)
    .setColor("#fff")
    .drawCircle(C.HOR_MARGIN, y, 10)
    .drawString(number, C.HOR_MARGIN + 2, y)
    // Text
    .drawString(text, 120, y + height / 2);
};

qmenu.prototype.handle123press = function(btn) {
  let item = this.menu.items[btn - 1];

  if (item.type === "menu") {
    this.setPath(item.id);
    this.render();
  } else if (item.type === "app") {
    load(item.id + ".app.js");
  } else if (item.type === "handler") {
    let handler = require("Storage").readJSON("setting.json").handlers[item.id];
    load(handler);
  }
};

exports.init = function(src) {
  return new qmenu(src);
};
