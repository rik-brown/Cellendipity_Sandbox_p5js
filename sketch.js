/*
 * Cellendipity Explorer
 * by Richard Brown
 * 26th November - 19th December
*/

var colony; // A colony object

function setup() {
  colorMode(HSB, 360, 255, 255, 255);
  createCanvas(windowWidth, windowHeight);
  ellipseMode(RADIUS);
  gs = new Global_settings();
  gui = new dat.GUI();
  initGUI();
  background(gs.bkgColor);
  if (gs.debug) {frameRate(15);}
  colony = new Colony(gs.colonySize);
}

function draw() {
  noStroke();
  if (gs.trailMode == 1 || gs.debug) {background(gs.bkgColor);}
  if (!gs.paused) {colony.run();}
  if (colony.dead()) {if (keyIsPressed || gs.autoRestart) {populateColony(); } }
}

function populateColony() {
  if (gs.randomizeOnRestart) {randomize();}
  background(gs.bkgColor); // Refresh the background
  if (gs.showInstructions) {instructions();}
  colony.cells = []; // Flush the colony (may not be necessary..)
  colony = new Colony(gs.colonySize);
}

function mousePressed() {
  var vel = p5.Vector.random2D();
  var dna = colony.genepool[floor(random(gs.numStrains))]; //get a random DNA from the genepool
  dna.genes[10] = height * 0.75; // workaround: overrides the Lifespan value for the strain to avoid spawning outside
  dna.genes[18] = mouseX;
  dna.genes[19] = mouseY;
  if (mouseX > (width-height)*0.5 && mouseX < (width+height)*0.5) {colony.spawn(vel, dna); colony.colonyAge = gs.colonyLifespan;}
}

function mouseDragged() {
  var vel = p5.Vector.random2D();
  var dna = colony.genepool[floor(random(gs.numStrains))]; //get a random DNA from the genepool
  dna.genes[10] = height * 0.75; // workaround: overrides the Lifespan value for the strain to avoid spawning outside
  dna.genes[18] = mouseX;
  dna.genes[19] = mouseY;
  if (mouseX > (width-height)*0.5 && mouseX < (width+height)*0.5) {colony.spawn(vel, dna); colony.colonyAge = gs.colonyLifespan;}
}

function screenDump() {
  saveCanvas('screendump.png', 'png');
}

function keyTyped() {
  if (key === ' ') {populateColony();}  //spacebar respawns with current settings
  if (key === 'c') {gs.centerSpawn = !gs.centerSpawn; colony.cells = [];} // C toggles 'centered' mode
  if (key === 'd') {gs.debug = !gs.debug;} // D toggles 'cell debug' mode
  if (key === 'i') {gs.showInstructions = !gs.showInstructions; populateColony();} // I toggles 'show instructions' mode
  if (key === 'n') {gs.nucleus = !gs.nucleus; populateColony();} // N toggles 'show nucleus' mode
  if (key === 'p') {gs.paused = !gs.paused;} // P toggles 'paused' mode
  if (key === 'r') {randomize(); populateColony();} // R for Randomize
  if (key === 's') {screenDump();} // S saves a screenshot
}

var initGUI = function () {
  var experimentMenu = gui.addFolder("Experiment");
  var controller = experimentMenu.add(gs, 'colonyLifespan', 100, 10000).step(100).name('Duration').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = experimentMenu.add(gs, 'colonyDuration', 1, 100).step(1).name('Active %').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = experimentMenu.add(gs, 'stepSize', 0, 100).name('Step').listen();
  //  controller.onChange(function(value) {if (gs.stepSize==0) {gs.stepped=false} else {gs.stepped=true; gs.stepSizeN = gs.stepSize; gs.trailMode = 3;}; populateColony();});
   controller.onChange(function(value) {if (gs.stepSize > 0) {gs.stepSizeN = gs.stepSize;} populateColony();});
  var controller = experimentMenu.add(gs, 'centerSpawn').name('Centered [C]').listen();
    controller.onChange(function(value) {populateColony(); });

  var cellsMenu = gui.addFolder('Cells');
  var controller = cellsMenu.add(gs, 'numStrains', 1, 5).step(1).name('Strains').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = cellsMenu.add(gs, 'strainSize', 1, 40).step(1).name('Seeds').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = cellsMenu.add(gs, 'colonyMaxSize', 10, 400).step(10).name('Maximum').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = cellsMenu.add(gs, 'variance', 0, 100).step(1).name('Diversity').listen();
    controller.onChange(function(value) {populateColony(); });

  var colourBasicMenu = gui.addFolder("Colour");
  var controller = colourBasicMenu.addColor(gs, 'bkgColHSV').name('Background').listen();
    controller.onChange(function(value) {gs.bkgColor = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'nucleusColHSVU').name('Nucleus (young)').listen();
    controller.onChange(function(value) {gs.nucleusColorU = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'nucleusColHSVF').name('Nucleus (adult)').listen();
    controller.onChange(function(value) {gs.nucleusColorF = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); populateColony();});

  var colourFillMenu = gui.addFolder("Colour - Fill");
  var controller = colourFillMenu.addColor(gs, 'strain1Fill').name('Strain 1').listen();
    controller.onChange(function(value) {colony.genepool[0].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourFillMenu.addColor(gs, 'strain2Fill').name('Strain 2').listen();
    controller.onChange(function(value) {colony.genepool[1].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourFillMenu.addColor(gs, 'strain3Fill').name('Strain 3').listen();
    controller.onChange(function(value) {colony.genepool[2].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourFillMenu.addColor(gs, 'strain4Fill').name('Strain 4').listen();
    controller.onChange(function(value) {colony.genepool[3].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourFillMenu.addColor(gs, 'strain5Fill').name('Strain 5').listen();
    controller.onChange(function(value) {colony.genepool[4].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourFillMenu.add(gs, 'bkgHueFillOffset', 0, 360).step(1).name('Bkground offset').listen();
    controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });
  var controller = colourFillMenu.add(gs, 'strainHueFillOffset', 0, 180).step(1).name('Strain offset').listen();
    controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });
  var controller = colourFillMenu.add(gs, 'globalFillSaturation', 0, 100).step(1).name('Saturation').listen();
    controller.onChange(function(value) {updateSatAllStrains(); populateColony(); });
  var controller = colourFillMenu.add(gs, 'globalFillBrightness', 0, 100).step(1).name('Brightness').listen();
    controller.onChange(function(value) {updateBrightAllStrains(); populateColony(); });
  var controller = colourFillMenu.add(gs, 'fill_A', 0, 255).step(1).name('Alpha').listen();
    controller.onChange(function(value) {populateColony(); });

  var colourLineMenu = gui.addFolder("Colour - Line");
  var controller = colourLineMenu.addColor(gs, 'strain1Stroke').name('Strain 1').listen();
    controller.onChange(function(value) {colony.genepool[0].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourLineMenu.addColor(gs, 'strain2Stroke').name('Strain 2').listen();
    controller.onChange(function(value) {colony.genepool[1].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourLineMenu.addColor(gs, 'strain3Stroke').name('Strain 3').listen();
    controller.onChange(function(value) {colony.genepool[2].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourLineMenu.addColor(gs, 'strain4Stroke').name('Strain 4').listen();
    controller.onChange(function(value) {colony.genepool[3].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourLineMenu.addColor(gs, 'strain5Stroke').name('Strain 5').listen();
    controller.onChange(function(value) {colony.genepool[4].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourLineMenu.add(gs, 'bkgHueStrokeOffset', 0, 360).step(1).name('Bkground offset').listen();
    controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });
  var controller = colourLineMenu.add(gs, 'strainHueStrokeOffset', 0, 180).step(1).name('Strain offset').listen();
    controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });
  var controller = colourLineMenu.add(gs, 'globalStrokeSaturation', 0, 100).step(1).name('Saturation').listen();
    controller.onChange(function(value) {updateSatAllStrains(); populateColony(); });
  var controller = colourLineMenu.add(gs, 'globalStrokeBrightness', 0, 100).step(1).name('Brightness').listen();
    controller.onChange(function(value) {updateBrightAllStrains(); populateColony(); });
  var controller = colourLineMenu.add(gs, 'stroke_A', 0, 255).step(1).name('Alpha').listen();
    controller.onChange(function(value) {populateColony(); });

  var fillColTweaksMenu = gui.addFolder("Colour - Transform");
  var controller = fillColTweaksMenu.add(gs, 'fill_HTwist', 0, 360).step(1).name('Fill Hue').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = fillColTweaksMenu.add(gs, 'fill_STwist', 0, 255).name('Fill Sat').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = fillColTweaksMenu.add(gs, 'fill_BTwist', 0, 255).name('Fill Bright').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = fillColTweaksMenu.add(gs, 'stroke_HTwist', 0, 360).step(1).name('Line Hue').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = fillColTweaksMenu.add(gs, 'stroke_STwist', 0, 255).name('Line Sat').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = fillColTweaksMenu.add(gs, 'stroke_BTwist', 0, 255).name('Line Bright').listen();
    controller.onChange(function(value) {populateColony(); });

  var shapeMenu = gui.addFolder("Shape");
  var controller = shapeMenu.add(gs, 'cellSSMax', 1, 100).step(1).name('Size (max)').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = shapeMenu.add(gs, 'cellESMax', 1, 100).step(1).name('Size (min%)').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = shapeMenu.add(gs, 'flatnessMax', 0, 100).step(1).name('Flatness').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = shapeMenu.add(gs, 'nucleus').name('Show nucleus [N]').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = shapeMenu.add(gs, 'stepSizeN', 0, 100).name('Step - nucleus').listen();
    controller.onChange(function(value) {populateColony(); });

  var behaviourMenu = gui.addFolder("Behaviour");
  var controller = behaviourMenu.add(gs, 'lifespanMax', 1, 100).step(1).name('Range').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = behaviourMenu.add(gs, 'noiseMax', 0, 100).step(1).name('Random').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = behaviourMenu.add(gs, 'spiralMax', 0, 180).step(0.5).name('Swirl').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = behaviourMenu.add(gs, 'fertility', 0, 90).step(1).name('Fertility').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = behaviourMenu.add(gs, 'spawnCount', 1, 5).step(1).name('Children').listen();
    controller.onChange(function(value) {populateColony(); });

  var controlsMenu = gui.addFolder("Controls");
    controlsMenu.add(gs, 'paused').name('Pause [P]').listen();
    controlsMenu.add(gs, 'restart').name('Restart [space]').listen();
    controlsMenu.add(gs, 'restartRandomized').name('Randomize [R]').listen();
    controlsMenu.add(gs, 'randomizeOnRestart').name('Random@restart');
    var controller = controlsMenu.add(gs, 'showInstructions').name('Instructions [ I ]').listen();
      controller.onChange(function(value) {populateColony(); });
    controlsMenu.add(gs, 'hide').name('Hide/show [H]');
    // optionsMenu.add(gs, 'autoRestart').name('Auto-restart');

  gui.close(); // GUI starts in closed state
}

function updateHueAllStrains() { //update the gs.HSV color object for all strains
  gs.strain1Fill.h = gs.bkgColHSV.h + gs.bkgHueFillOffset;
  if (gs.strain1Fill.h > 360) {gs.strain1Fill.h -= 360;}

  gs.strain1Stroke.h = gs.bkgColHSV.h + gs.bkgHueStrokeOffset;
  if (gs.strain1Stroke.h > 360) {gs.strain1Stroke.h -= 360;}

  gs.strain2Fill.h = gs.strain1Fill.h + (gs.strainHueFillOffset);
  if (gs.strain2Fill.h > 360) {gs.strain2Fill.h -= 360;}
  gs.strain3Fill.h = gs.strain2Fill.h + (gs.strainHueFillOffset);
  if (gs.strain3Fill.h > 360) {gs.strain3Fill.h -= 360;}
  gs.strain4Fill.h = gs.strain3Fill.h + (gs.strainHueFillOffset);
  if (gs.strain4Fill.h > 360) {gs.strain4Fill.h -= 360;}
  gs.strain5Fill.h = gs.strain4Fill.h + (gs.strainHueFillOffset);
  if (gs.strain5Fill.h > 360) {gs.strain5Fill.h -= 360;}

  gs.strain2Stroke.h = gs.strain1Stroke.h + (gs.strainHueStrokeOffset);
  if (gs.strain2Stroke.h > 360) {gs.strain2Stroke.h -= 360;}
  gs.strain3Stroke.h = gs.strain2Stroke.h + (gs.strainHueStrokeOffset);
  if (gs.strain3Stroke.h > 360) {gs.strain3Stroke.h -= 360;}
  gs.strain4Stroke.h = gs.strain3Stroke.h + (gs.strainHueStrokeOffset);
  if (gs.strain4Stroke.h > 360) {gs.strain4Stroke.h -= 360;}
  gs.strain5Stroke.h = gs.strain4Stroke.h + (gs.strainHueStrokeOffset);
  if (gs.strain5Stroke.h > 360) {gs.strain5Stroke.h -= 360;}

}

function updateSatAllStrains() { //update the gs.HSV color object for all strains
  gs.strain1Fill.s = gs.globalFillSaturation * 0.01; // THIS IS NOT THE CORRECT WAY TO CHANGE THIS VALUE!!
  gs.strain2Fill.s = gs.globalFillSaturation * 0.01;
  gs.strain3Fill.s = gs.globalFillSaturation * 0.01;
  gs.strain4Fill.s = gs.globalFillSaturation * 0.01;
  gs.strain5Fill.s = gs.globalFillSaturation * 0.01;

  gs.strain1Stroke.s = gs.globalStrokeSaturation * 0.01;
  gs.strain2Stroke.s = gs.globalStrokeSaturation * 0.01;
  gs.strain3Stroke.s = gs.globalStrokeSaturation * 0.01;
  gs.strain4Stroke.s = gs.globalStrokeSaturation * 0.01;
  gs.strain5Stroke.s = gs.globalStrokeSaturation * 0.01;
}


function updateBrightAllStrains() { //update the gs.HSV color object for all strains
  gs.strain1Fill.v = gs.globalFillBrightness * 0.01;
  gs.strain2Fill.v = gs.globalFillBrightness * 0.01;
  gs.strain3Fill.v = gs.globalFillBrightness * 0.01;
  gs.strain4Fill.v = gs.globalFillBrightness * 0.01;
  gs.strain5Fill.v = gs.globalFillBrightness * 0.01;

  gs.strain1Stroke.v = gs.globalStrokeBrightness * 0.01;
  gs.strain2Stroke.v = gs.globalStrokeBrightness * 0.01;
  gs.strain3Stroke.v = gs.globalStrokeBrightness * 0.01;
  gs.strain4Stroke.v = gs.globalStrokeBrightness * 0.01;
  gs.strain5Stroke.v = gs.globalStrokeBrightness * 0.01;
}

function randomize() { // Parameters are randomized (more than in the initial configuration)
  //Experiment
  if (random(1) > 0.6) {gs.stepSize = int(random(20,50)); gs.stepSizeN = gs.stepSize;} else {gs.stepSize = 0; gs.stepSizeN = int(random(20, 50));}
  if (random(1) > 0.5) {gs.centerSpawn = true;} else {gs.centerSpawn = false;}

  //Cells
  gs.numStrains = floor(random(1, 5));
  gs.strainSize = floor(random(1, 20)); // Number of cells in a strain
  gs.colonyMaxSize = floor(random((gs.numStrains*gs.strainSize), 300));
  gs.variance = floor(random(100));

  // Colour
  gs.bkgColHSV = { h: random(360), s: random(), v: random() };
  gs.bkgColor = color(gs.bkgColHSV.h, gs.bkgColHSV.s*255, gs.bkgColHSV.v*255);
  gs.nucleusColHSVU = { h: random(360), s: random(), v: random() };
  gs.nucleusColorU = color(gs.nucleusColHSVU.h, gs.nucleusColHSVU.s*255, gs.nucleusColHSVU.v*255);
  gs.nucleusColHSVF = { h: random(360), s: random(), v: random() };

  // Colour - Fill
  gs.strain1Fill = { h: random(360), s: random(), v: random() };
  gs.strain2Fill = { h: random(360), s: random(), v: random() };
  gs.strain3Fill = { h: random(360), s: random(), v: random() };
  gs.strain4Fill = { h: random(360), s: random(), v: random() };
  gs.strain5Fill = { h: random(360), s: random(), v: random() };
  if (random(1) > 0.5) {gs.fill_A = floor(random (1,255));} else {gs.fill_A = floor(random(0,3));}

  // Colour - Line
  gs.strain1Stroke = { h: random(360), s: random(), v: random() };
  gs.strain2Stroke = { h: random(360), s: random(), v: random() };
  gs.strain3Stroke = { h: random(360), s: random(), v: random() };
  gs.strain4Stroke = { h: random(360), s: random(), v: random() };
  gs.strain5Stroke = { h: random(360), s: random(), v: random() };
  if (random(1) > 0.5) {gs.stroke_A = floor(random (1,255));} else {gs.stroke_A =  floor(random(0,3));}


  // Colour - transform
  if (random(1) > 0.6) {gs.fill_HTwist = floor(random(1, 360));} else {gs.fill_HTwist = 0;}
  if (random(1) > 0.6) {gs.fill_STwist = floor(random (1,255));} else {gs.fill_STwist = 0;}
  if (random(1) > 0.6) {gs.fill_BTwist = floor(random (1,255));} else {gs.fill_BTwist = 0;}
  if (random(1) > 0.6) {gs.stroke_HTwist = floor(random(1, 360));} else {gs.stroke_HTwist = 0;}
  if (random(1) > 0.6) {gs.stroke_STwist = floor(random (1,255));} else {gs.stroke_STwist = 0;}
  if (random(1) > 0.6) {gs.stroke_BTwist = floor(random (1,255));} else {gs.stroke_BTwist = 0;}

  // Shape
  gs.cellSSMax = floor(random(5,50));  // Cell start size
  gs.cellESMax = floor(random(100));   // Cell end size ) % of cellStartSize
  if (random(1) > 0.7) {gs.flatnessMax = floor(random (0,100));} else {gs.flatnessMax = 0;}
  if (random(1) > 0.7) {gs.nucleus = true;} else {gs.nucleus = false;}

  // Behaviour
  gs.lifespanMax = floor(random(30, 70));
  gs.noiseMax = floor(random(100));
  gs.spiralMax = floor(random(180));
  gs.fertility = floor(random(50, 90));
  gs.spawnCount = floor(random(2,5));
}

function instructions() { // Displays some brief guidelines about the menu & keyboard shortcuts
  if (gs.bkgColHSV.v > 0.7) {fill(0);} else {fill(360);}
  textFont("Courier New");

  textSize(32);
  textStyle(BOLD);
  text("Cellendipity Explorer", 10, 35);

  // textSize(12);
  // textStyle(NORMAL);
  // text("by Richard Brown", 10, 50);

  textSize(15);
  textStyle(NORMAL);
  text("Cells move about,", 10, 60);
  text("have brief encounters,", 10, 78);
  text("spawn more cells & die.", 10, 96);

  //textSize(20);
  textStyle(BOLD);
  text("Keys:", 10, 150);

  textSize(15);
  textStyle(NORMAL);
  text("Space   Restart (keep settings)", 10, 170);
  text("R       Restart (randomize settings)", 10, 188);
  text("C       Toggles center/random seed", 10, 206);
  text("N       Toggles cell nucleus", 10, 224);
  text("H       Toggles menu", 10, 242);
  text("I       Toggles Instructions", 10, 260);
  text("S       Screenshot (.png)", 10, 278);
  text("P       Pause", 10, 296);

  //textSize(20);
  textStyle(BOLD);
  text("Menu:", 10, 320);

  textSize(15);
  textStyle(NORMAL);
  text("Try things out!", 10, 338);
  text("(you can't break anything)", 10, 356);

  textStyle(BOLD);
  text("Follow @Cellendipity on:", 10, 390);

  textStyle(NORMAL);
  text("Twitter, Tumblr, Instagram", 10, 408);
  text("Tag your screenshots with #cellendipity", 10, 426);
  text("and share the cellular love!", 10, 444);
  textStyle(BOLD);
  text("Contact: cellendipity@gmail.com", 10, 476);

  textSize(12);
  textStyle(NORMAL);
  text("© Richard Brown, December 19th 2016", 10, 500);
}
