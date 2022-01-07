let name = require("Storage").readJSON("config.json").locale;

exports = {
  name: name,

  number: (n, dec) => {
    if (dec == null) dec = 2;
    let w = n.toFixed(dec),
        k = w|0,
        b = n < 0 ? 1 : 0,
        u = Math.abs(w-k),
        d = (''+u.toFixed(dec)).substr(2, dec),
        s = ''+k,
        i = s.length,
        r = '';
    while ((i-=3) > b) {
      r = exports.thousandsSep + s.substr(i, 3) + r;
    }
    return s.substr(0, i + 3) + r + (d ? exports.decimalPoint + d: '');
  },

  currency: (n) => {
    if (exports.currencyFirst) {
      return exports.currencySym + exports.number(n);
    } else {
      return exports.number + exports.currencySym(n);
    }
  }
};

exports = Object.assign(exports, require("Storage").readJSON("locale_" + name + ".json"));
