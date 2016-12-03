function Global_settings() { //These are the initial values, not the randomised ones
  this.debug = false;
  this.autoRestart = true; // If true, will not wait for keypress before starting anew
  this.trailMode = 3; // 1=none, 2 = blend, 3 = continuous
  this.blackStrain = true;

  if (random(1) > 0.5) {this.centerSpawn = true;} else {this.centerSpawn = false;}

  this.colonyMaxSize = 200; // Max number of cells in the colony
  this.colonyLifespan = 1000;             // Max number of frames a colony can live for
  this.colonyDuration = 500;             // Max number of frames a colony is active for
  //this.numStrains = int(random(1,1));  // Number of strains (a group of cells sharing the same DNA)
  //this.strainSize = int(random(1,1));  // Number of cells in a strain
  this.numStrains = 2;
  this.strainSize = int(random(6, 16)/this.numStrains); // Number of cells in a strain

  this.cellSSMax = 100; // Absolute value
  this.cellSSMin = 50;  // Absolute value
  this.cellESMax = 30;  // % of cellStartSize
  this.cellESMin = 5;   // % of cellStartSize
  this.lifespanMax = 70;
  this.lifespanMin = 30;
  this.noiseMax = 100;
  this.noiseMin = 0;
  this.spiralMin = 0;
  this.spiralMax = 180;

  this.bkgColHSV = { h: random(360), s: random(64, 128), v: random(128, 255) };
  this.bkgColor = color(this.bkgColHSV.h, this.bkgColHSV.s*255, this.bkgColHSV.v*255); // Background colour

  this.fill_H_Min = 0;
  this.fill_H_Max = 360;
  this.fill_S_Min = 128;
  this.fill_S_Max = 255;
  this.fill_B_Min = 196;
  this.fill_B_Max = 255;
  this.fill_A_Min = 5;
  this.fill_A_Max = 5;

  this.stroke_H_Min = 0;
  this.stroke_H_Max = 360;
  this.stroke_S_Min = 0;
  this.stroke_S_Max = 255;
  this.stroke_B_Min = 0;
  this.stroke_B_Max = 255;
  this.stroke_A_Min = 5;
  this.stroke_A_Max = 5;

  //this.nucleusHue = this.bkgColHSV.h + 180;
  //if (this.nucleusHue > 360) {this.nucleusHue -= 360;}
  this.nucleusColHSVU = { h: 255, s: 0, v: 255 };  // White
  this.nucleusColorU = color(this.nucleusColHSVU.h, this.nucleusColHSVU.s*255, this.nucleusColHSVU.v*255); // Background colour
  this.nucleusColHSVF = { h: 0, s: 255, v: 0 };    // Black
  this.nucleusColorF = color(this.nucleusColHSVF.h, this.nucleusColHSVF.s*255, this.nucleusColHSVF.v*255); // Background colour
  //this.nucleusColorU = color(this.nucleusHue, 255, 255); // White
  //this.nucleusColorF = color(0, 255, 0); // Black


  //this.nucleus = false;
  if (random(1) > 0.3) {this.nucleus = true;} else {this.nucleus = false;}

  this.stepped = true;
  if (random(1) > 0.5) {this.stepSize = int(random(20,60)); this.stepSizeN = this.stepSize;} else {this.stepSize = 0; this.stepSizeN = int(random(20, 50));}
  //this.stepSize = 0;
  //this.stepSizeN = 0;

  this.fillDisable = false;
  this.fill_HTwist = 0;
  this.fill_STwist = 200;
  this.fill_BTwist = 0;
  this.fill_ATwist = 0;

  this.strokeDisable = false;
  this.stroke_HTwist = 0;
  this.stroke_STwist = 0;
  this.stroke_BTwist = 0;
  this.stroke_ATwist = 0;

  this.restart = function() {populateColony();};
  this.randomRestart = function() {randomizer(); colony.cells = []; populateColony();};

}
