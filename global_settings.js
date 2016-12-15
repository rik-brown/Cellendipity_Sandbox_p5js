function Global_settings() { //These are the initial values, not the randomised ones
  // Not in GUI menu:
  this.debug = false;
  this.trailMode = 3;  // 1=none, 2 = blend, 3 = continuous
  this.homeX = width*0.5;
  this.homeY = height*0.5;

  //optionsMenu---Experiment
  this.colonyLifespan = 4000;             // Max number of frames a colony can live for
  this.colonyDuration = 60;             // Max number of frames a colony is active for
  this.stepped = true;
  this.stepSize = 0;
  this.stepSizeN = int(random(20, 50));
  // if (random(1) > 0.5) {this.stepSize = int(random(20,60)); this.stepSizeN = this.stepSize;} else {this.stepSize = 0; this.stepSizeN = int(random(20, 50));}
  this.bkgColHSV = { h: random(360), s: random(0.25, 0.5), v: random(0.5, 1) };
  this.bkgColor = color(this.bkgColHSV.h, this.bkgColHSV.s*255, this.bkgColHSV.v*255); // Background colour

  this.bkgHueFillOffset=random(3, 355);   // strain1Fill.h will be offset from bkgCol.h by this amount
  this.bkgHueStrokeOffset=random(3, 355); // strain1Stroke.h will be offset from bkgCol.h by this amount
  this.strainHueFillOffset=random(1, 50);             // strain(n+1)Stroke.h will be offset from strain(n)Stroke.h by this amount
  this.strainHueStrokeOffset=random(1, 50);             // strain(n+1)Stroke.h will be offset from strain(n)Stroke.h by this amount

  this.autoRestart = true;         // If true, will not wait for keypress before starting anew
  this.randomizeOnRestart = false; // If true, parameters will be randomized on restart

  //seedMenu---Seed Cultures
  this.numStrains = 5;
  this.strainSize = int(random(6, 16)/this.numStrains); // Number of cells in a strain
  this.colonyMaxSize = 200; // Max number of cells in the colony
  if (random(1) > 0.5) {this.centerSpawn = true;} else {this.centerSpawn = false;}

  //strain1-5Menu---Strain A-E
  this.fill_S_Min = 0.5;
  this.fill_S_Max = 1;
  this.fill_B_Min = 0.8;
  this.fill_B_Max = 1;


  this.strain1Fill = { h: 0, s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };
  this.strain1Fill.h = this.bkgColHSV.h + this.bkgHueFillOffset;
  if (this.strain1Fill.h > 360) {this.strain1Fill.h -= 360;}

  this.strain2Fill = { h: random(360), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };
  this.strain3Fill = { h: random(360), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };
  this.strain4Fill = { h: random(360), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };
  this.strain5Fill = { h: random(360), s: random(this.fill_S_Min, this.fill_S_Max), v: random(this.fill_B_Min, this.fill_B_Max) };

  this.strain2Fill.h = this.strain1Fill.h + (this.strainHueFillOffset * 3.6/this.numStrains);
  if (this.strain2Fill.h > 360) {this.strain2Fill.h -= 360;}
  this.strain3Fill.h = this.strain2Fill.h + (this.strainHueFillOffset * 3.6/this.numStrains);
  if (this.strain3Fill.h > 360) {this.strain3Fill.h -= 360;}
  this.strain4Fill.h = this.strain3Fill.h + (this.strainHueFillOffset * 3.6/this.numStrains);
  if (this.strain4Fill.h > 360) {this.strain4Fill.h -= 360;}
  this.strain5Fill.h = this.strain4Fill.h + (this.strainHueFillOffset * 3.6/this.numStrains);
  if (this.strain5Fill.h > 360) {this.strain5Fill.h -= 360;}

  this.stroke_S_Min = 0.5;
  this.stroke_S_Max = 1;
  this.stroke_B_Min = 0.8;
  this.stroke_B_Max = 1;

  this.strain1Stroke = { h: 0, s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };
  this.strain1Stroke.h = this.bkgColHSV.h + this.bkgHueStrokeOffset;
  if (this.strain1Stroke.h > 360) {this.strain1Stroke.h -= 360;}
  this.strain2Stroke = { h: 0, s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };
  this.strain3Stroke = { h: 0, s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };
  this.strain4Stroke = { h: 0, s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };
  this.strain5Stroke = { h: 0, s: random(this.stroke_S_Min, this.stroke_S_Max), v: random(this.stroke_B_Min, this.stroke_B_Max) };

  this.strain2Stroke.h = this.strain1Stroke.h + (this.strainHueStrokeOffset * 3.6/this.numStrains);
  if (this.strain2Stroke.h > 360) {this.strain2Stroke.h -= 360;}
  this.strain3Stroke.h = this.strain2Stroke.h + (this.strainHueStrokeOffset * 3.6/this.numStrains);
  if (this.strain3Stroke.h > 360) {this.strain3Stroke.h -= 360;}
  this.strain4Stroke.h = this.strain3Stroke.h + (this.strainHueStrokeOffset * 3.6/this.numStrains);
  if (this.strain4Stroke.h > 360) {this.strain4Stroke.h -= 360;}
  this.strain5Stroke.h = this.strain4Stroke.h + (this.strainHueStrokeOffset * 3.6/this.numStrains);
  if (this.strain5Stroke.h > 360) {this.strain5Stroke.h -= 360;}


  //fillColTweaksMenu---Cytoplasm mods
  this.fill_HTwist = 0;
  this.fill_STwist = 0; // Last: 200
  this.fill_BTwist = 0;
  this.fill_A = 15;

  //strokeColTweaksMenu---Membrane mods
  this.stroke_HTwist = 0;
  this.stroke_STwist = 0;
  this.stroke_BTwist = 0;
  this.stroke_A = 15;

  //nucleusMenu---Nucleus mods
  if (random(1) > 0.3) {this.nucleus = true;} else {this.nucleus = false;}
  this.nucleusColHSVU = { h: 360, s: 0, v: 1 };  // White
  //this.nucleusColHSVU.h = this.bkgColHSV.h + 180;
  //if (this.nucleusColHSVU.h > 360) {this.nucleusColHSVU.h -= 360;}
  this.nucleusColorU = color(this.nucleusColHSVU.h, this.nucleusColHSVU.s*255, this.nucleusColHSVU.v*255); // Background colour

  this.nucleusColHSVF = { h: 0, s: 1, v: 0 };    // Black
  this.nucleusColorF = color(this.nucleusColHSVF.h, this.nucleusColHSVF.s*255, this.nucleusColHSVF.v*255); // Background colour

  //dnaMenu---DNA mods
  this.variance = 0;    // 0-100 where 100 = 100% or max. variance
  //this.cellSSMin = 50;  // Absolute value
  this.cellSSMax = random(20, 80); // Absolute value
  //this.cellESMin = 5;   // % of cellStartSize
  this.cellESMax = 30;  // % of cellStartSize
  this.lifespanMin = 30;
  this.lifespanMax = 70;
  this.flatnessMax = 0;
  this.noiseMin = 0;
  this.noiseMax = 70;
  this.spiralMin = 0;
  this.spiralMax = 90;
  this.fertility = 75;
  this.spawnCount = 3;

  //colourMods---test
  this.globalFillSaturation=100; // 100 = 100% of current value? Reducing will be a %multiplier down to zero
  this.globalFillBrightness=100; // 100 = 100% of current value? Reducing will be a %multiplier down to zero
  this.globalStrokeSaturation=100; // 100 = 100% of current value? Reducing will be a %multiplier down to zero
  this.globalStrokeBrightness=100; // 100 = 100% of current value? Reducing will be a %multiplier down to zero


  this.restart = function() {populateColony();}; // Action-button to respawn a new colony [R] key
  this.restartRandomized = function() {randomize(); populateColony();};
  this.paused = false; // If true, colony will not be run on draw-cycle
  this.showInstructions = false;   // If true, will display on-screen instructions

  this.hide = function () {};
}
