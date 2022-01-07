let X = 25, Y = 35;
let BIG_SIZE = 60, SMALL_SIZE = 30, GAP = 20;
let X2 = X + BIG_SIZE + GAP;
let X3 = X2 + BIG_SIZE + GAP;

let elements = [
  "",   "H",  "He", "Li", "Be", "B",  "C",  "N",  "O",  "F",  "Ne",
  "Na", "Mg", "Al", "Si", "P",  "S",  "Cl", "Ar", "K",  "Ca",
  "Sc", "Ti", "V",  "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
  "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y",  "Zr",
  "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
  "Sb", "Te", "I",  "Xe", "Cs", "Ba", "La", "Ce", "Pr",
];

function draw() {
  let d = new Date();
  let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();

  g.reset();
  g.setFont("6x8", Math.floor(BIG_SIZE / 15));
  g.setFontAlign(0, 0);

  g.clearRect(X, Y, 240 - X, Y + BIG_SIZE);

  // Hours
  g.drawRect(X, Y, X + BIG_SIZE, Y + BIG_SIZE);
  g.drawString(elements[h], X + BIG_SIZE / 2, Y + BIG_SIZE / 2);

  // Minutes
  g.drawRect(X2, Y, X2 + BIG_SIZE, Y + BIG_SIZE);
  g.drawString(elements[m], X2 + BIG_SIZE / 2, Y + BIG_SIZE / 2);

  // Seconds
  g.setFont("6x8", Math.floor(SMALL_SIZE / 15));
  g.drawRect(X3, Y + BIG_SIZE - SMALL_SIZE, X3 + SMALL_SIZE, Y + BIG_SIZE);
  g.drawString(elements[s], X3 + SMALL_SIZE / 2, Y + BIG_SIZE - SMALL_SIZE / 2);
  
  // Date
  g.drawString(("0"+d.getDate()).substr(-2) + "/" + ("0"+(d.getMonth() + 1)).substr(-2) + "/" + d.getFullYear(), 120, Y + BIG_SIZE + 30);
}

g.clear();
draw();
let secondInterval = setInterval(draw, 1000);

Bangle.loadWidgets();
Bangle.drawWidgets();

Bangle.setUI("clock");

// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower', on =>{
  if (secondInterval) clearInterval(secondInterval);
  secondInterval = undefined;
  if (on) {
    secondInterval = setInterval(draw, 1000);
    draw(); // draw immediately
  }
});

setWatch(() => {
  load("qlaunch.app.js");
}, BTN1);
