function Global_settings() { //These are the initial values, not the randomised ones
  // Not in GUI menu:
  this.debug = false;
  this.trailMode = 3; // 1=none, 2 = blend, 3 = continuous

  // COLONY GUI menu:
  this.colonyLifespan = 4000;             // Max number of frames a colony can live for
  this.colonyDuration = 2500;             // Max number of frames a colony is active for
  this.numStrains = 3;
  this.strainSize = int(random(6, 16)/this.numStrains); // Number of cells in a strain
  this.colonyMaxSize = 200; // Max number of cells in the colony
  if (random(1) > 0.5) {this.centerSpawn = true;} else {this.centerSpawn = false;}


  this.cellSSMin = 50;  // Absolute value
  this.cellSSMax = 100; // Absolute value
  this.cellESMin = 5;   // % of cellStartSize
  this.cellESMax = 30;  // % of cellStartSize
  this.lifespanMin = 30;
  this.lifespanMax = 70;
  this.noiseMin = 0;
  this.noiseMax = 100;
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
  this.fill_A = 5;

  this.stroke_H_Min = 0;
  this.stroke_H_Max = 360;
  this.stroke_S_Min = 0;
  this.stroke_S_Max = 255;
  this.stroke_B_Min = 0;
  this.stroke_B_Max = 255;
  this.stroke_A_Min = 5;
  this.stroke_A_Max = 5;
  this.stroke_A = 5;


this.homeX = width*0.5;
this.homeY = height*0.5;


  this.strain1Fill = { h: random(this.fill_H_Min, this.fill_H_Max), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };
  this.strain2Fill = { h: random(this.fill_H_Min, this.fill_H_Max), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };
  this.strain3Fill = { h: random(this.fill_H_Min, this.fill_H_Max), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };
  this.strain4Fill = { h: random(this.fill_H_Min, this.fill_H_Max), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };
  this.strain5Fill = { h: random(this.fill_H_Min, this.fill_H_Max), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };

  this.strain1Stroke = { h: random(this.stroke_H_Min, this.stroke_H_Max), s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };
  this.strain2Stroke = { h: random(this.stroke_H_Min, this.stroke_H_Max), s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };
  this.strain3Stroke = { h: random(this.stroke_H_Min, this.stroke_H_Max), s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };
  this.strain4Stroke = { h: random(this.stroke_H_Min, this.stroke_H_Max), s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };
  this.strain5Stroke = { h: random(this.stroke_H_Min, this.stroke_H_Max), s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };

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

  this.fill_HTwist = 0;
  this.fill_STwist = 200;
  this.fill_BTwist = 0;
  this.fill_ATwist = 0;

  this.stroke_HTwist = 0;
  this.stroke_STwist = 0;
  this.stroke_BTwist = 0;
  this.stroke_ATwist = 0;

  this.restart = function() {populateColony();}; // Action-button to respawn a new colony [R] key
  this.restartRandomized = function() {randomize(); populateColony();};

  this.autoRestart = true;         // If true, will not wait for keypress before starting anew
  this.randomizeOnRestart = false; // If true, parameters will be randomized on restart
  this.showInstructions = true;   // If true, will display on-screen instructions
  this.hide = function () {};
}
