function Global_settings() { //These are the initial values, not the randomised ones
  this.colonySize = int(random (20,80)); // Max number of cells in the colony
  this.strainSize = int(random(1,1)); // Number of cells in a strain
  this.numStrains = int(random(1,1)); // Number of strains (a group of cells sharing the same DNA)

  this.centerSpawn = false; // true=initial spawn is width/2, height/2 false=random
  this.autoRestart = false; // If true, will not wait for keypress before starting anew

  this.bkgColHSV = { h: random(360), s: random(255), v: random(255) };
  this.bkgColor = color(this.bkgColHSV.h, this.bkgColHSV.s*255, this.bkgColHSV.v*255); // Background colour

  this.fill_HTwist = 0;
  this.fill_STwist = 255;
  this.fill_BTwist = 128;
  this.fill_ATwist = 255;
  this.stroke_HTwist = 0;
  this.stroke_STwist = 255;
  this.stroke_BTwist = 128;
  this.stroke_ATwist = 255;

  this.fillDisable = false;
  this.strokeDisable = false;

  this.nucleus = false;

  this.stepSize = 0;
  this.stepSizeN = 00;
  this.stepped = false;

  this.wraparound = true;
  this.trailMode = 3; // 1=none, 2 = blend, 3 = continuous

  this.restart = function () {colony.cells = []; populateColony();};
  this.randomRestart = function () {randomizer(); colony.cells = []; populateColony();};
  this.debug = true;

}
