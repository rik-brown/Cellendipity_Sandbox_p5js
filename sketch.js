/*
 * Cellendipity Sandbox
 * by Richard Brown
 * 26th November
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
  if (gs.debug) {frameRate(10);}
  colony = new Colony(gs.colonySize);
}

function draw() {
  noStroke();
  fill(0, 32);
  rect(0, 0, (width-height)*0.5, height);     // Left border
  rect((width+height)*0.5, 0, width, height); // Right border
  if (gs.trailMode == 1 || gs.debug) {background(gs.bkgColor);}
  //if (gs.trailMode == 2) {trails();}
  colony.run();
  if (colony.dead()) {if (keyIsPressed || gs.autoRestart) {populateColony(); } }
  //if (colony.colonyAge < 0) {populateColony(); }
  //if (colony.cells.length === 0 || colony.colonyAge < 0) {if (keyIsPressed || gs.autoRestart) {populateColony(); } } // Repopulate the colony when all the cells have died
  //if (colony.colonyAge < 0) {if (keyIsPressed || gs.autoRestart) {populateColony(); } } // Repopulate the colony when all the cells have died
}

function populateColony() {
  background(gs.bkgColor); // Refresh the background
  colony.cells = [];
  colony = new Colony(gs.colonySize);
}

// function trails() { // Neat trick to create smooth, long trails
//   blendMode(DIFFERENCE);
//   noStroke();
//   fill(1);
//   rect(-1, -1, width + 1, height + 1);
//   blendMode(BLEND);
//   fill(255);
// }

function mousePressed() {
  var vel = p5.Vector.random2D();
  // var dna = new DNA(); // creates a new DNA with randomised values
  var dna = colony.genepool[floor(random(gs.numStrains))];
  dna.genes[10] = height * 0.75; // workaround: overrides the Lifespan value for the strain to avoid spawning outside
  dna.genes[18] = mouseX;
  dna.genes[19] = mouseY;
  //gs.homeX = mouseX; // experiment to allow home to be moved around the screen
  //gs.homeY = mouseY; // experiment to allow home to be moved around the screen
  //if (mousePos.x < (width-270)) {colony.spawn(vel, dna);}
  if (mouseX > (width-height)*0.5 && mouseX < (width+height)*0.5) {colony.spawn(vel, dna);}
}

function mouseDragged() {
  var vel = p5.Vector.random2D();
  //var dna = new DNA(); // creates a new DNA with randomised values
  var dna = colony.genepool[floor(random(gs.numStrains))];
  dna.genes[10] = height * 0.75; // workaround: overrides the Lifespan value for the strain to avoid spawning outside
  dna.genes[18] = mouseX;
  dna.genes[19] = mouseY;
  // gs.homeX = mouseX;
  // gs.homeY = mouseY;
  //if (mousePos.x < (width-270)) {colony.spawn(vel, dna);}
  if (mouseX > (width-height)*0.5 && mouseX < (width+height)*0.5) {colony.spawn(vel, dna);}
}

function screenDump() {
  saveCanvas('screendump.png', 'png');
}

function keyTyped() {
  //if (key === '1') {gs.trailMode = 1;} // '1' sets trailMode = 1 (None)
  //if (key === '2') {gs.trailMode = 2;} // '2' sets trailMode = 2 (Blended)
  //if (key === '3') {gs.trailMode = 3;} // '3' sets trailMode = 3 (Continuous)
  if (key === 'd') {gs.debug = !gs.debug;} // D toggles 'cell debug' mode

  if (key === ' ') {populateColony();}  //spacebar respawns with current settings
  if (key === 'c') {gs.centerSpawn = !gs.centerSpawn; colony.cells = [];} // C toggles 'centered' mode
  if (key === 'n') {gs.nucleus = !gs.nucleus;} // N toggles 'show nucleus' mode
  if (key === 's') {screenDump();} // S saves a screenshot
  if (key === 'r') {randomizer(); colony.cells = [];} // R for Randomize
}

var initGUI = function () {
	var controller = gui.add(gs, 'colonyMaxSize', 1, 500).step(10).name('Colony Size').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'colonyLifespan', 500, 10000).step(500).name('MaxFrames').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'colonyDuration', 100, 5000).step(100).name('MaxActiveFrames').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'numStrains', 1, 10).step(1).name('Strains').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'strainSize', 1, 20).step(1).name('Cells in Strain').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'blackStrain').name('blackStrain');
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'centerSpawn').name('Centered [C]').listen();
	  controller.onChange(function(value) {populateColony(); });

  var f3 = gui.addFolder("DNA overrides");
  var controller = f3.add(gs, 'cellSSMin', 1, 250).step(1).name('cellStartSizeMin').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'cellSSMax', 1, 250).step(1).name('cellStartSizeMax').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'cellESMin', 1, 100).step(1).name('cellEndSizeMin').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'cellESMax', 1, 100).step(1).name('cellEndSizeMax').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'lifespanMin', 1, 100).step(1).name('lifespanMin').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'lifespanMax', 1, 100).step(1).name('lifespanMax').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'noiseMin', 0, 100).step(1).name('noise%Min').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'noiseMax', 0, 100).step(1).name('noise%Max').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'spiralMin', -360, 0).step(5).name('SpiralMinDegrees').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = f3.add(gs, 'spiralMax', 0, 360).step(5).name('SpiralMaxDegrees').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.addColor(gs, 'bkgColHSV').name('Background color').listen();
    controller.onChange(function(value) {gs.bkgColor = color(value.h, value.s*255, value.v*255); background(gs.bkgColor);});
  var controller = gui.addColor(gs, 'nucleusColHSVU').name('NucleusU color').listen();
    controller.onChange(function(value) {gs.nucleusColorU = color(value.h, value.s*255, value.v*255); background(gs.bkgColor);});
  var controller = gui.addColor(gs, 'nucleusColHSVF').name('NucleusF color').listen();
    controller.onChange(function(value) {gs.nucleusColorF = color(value.h, value.s*255, value.v*255); background(gs.bkgColor);});

	var f4 = gui.addFolder("Fill Color Tweaks");
	  f4.add(gs, 'fill_HTwist', 0, 360).step(1).name('Hue').listen();
    f4.add(gs, 'fill_STwist', 0, 255).name('Saturation').listen();
    f4.add(gs, 'fill_BTwist', 0, 255).name('Brightness').listen();
    f4.add(gs, 'fill_ATwist', 0, 255).name('Alpha.').listen();
    var controller = f4.add(gs, 'fill_H_Min', 0, 360).step(1).name('fillHMin').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f4.add(gs, 'fill_H_Max', 0, 360).step(1).name('fillHMax').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f4.add(gs, 'fill_S_Min', 0, 255).step(1).name('fillSMin').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f4.add(gs, 'fill_S_Max', 0, 255).step(1).name('fillSMax').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f4.add(gs, 'fill_B_Min', 0, 255).step(1).name('fillBMin').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f4.add(gs, 'fill_B_Max', 0, 255).step(1).name('fillBMax').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f4.add(gs, 'fill_A_Min', 0, 255).step(1).name('fillAMin').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f4.add(gs, 'fill_A_Max', 0, 255).step(1).name('fillAMax').listen();
      controller.onChange(function(value) {populateColony(); });
    f4.add(gs, 'fillDisable').name('Fill OFF');

  var f5 = gui.addFolder("Stroke Color Tweaks");
  	f5.add(gs, 'stroke_HTwist', 0, 360).step(1).name('Hue').listen();
    f5.add(gs, 'stroke_STwist', 0, 255).name('Saturation').listen();
    f5.add(gs, 'stroke_BTwist', 0, 255).name('Brightness').listen();
    f5.add(gs, 'stroke_ATwist', 0, 255).name('Alpha').listen();
    var controller = f5.add(gs, 'stroke_H_Min', 0, 360).step(1).name('strokeHMin').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f5.add(gs, 'stroke_H_Max', 0, 360).step(1).name('strokeHMax').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f5.add(gs, 'stroke_S_Min', 0, 255).step(1).name('strokeSMin').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f5.add(gs, 'stroke_S_Max', 0, 255).step(1).name('strokeSMax').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f5.add(gs, 'stroke_B_Min', 0, 255).step(1).name('strokeBMin').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f5.add(gs, 'stroke_B_Max', 0, 255).step(1).name('strokeBMax').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f5.add(gs, 'stroke_A_Min', 0, 255).step(1).name('strokeAMin').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = f5.add(gs, 'stroke_A_Max', 0, 255).step(1).name('strokeAMax').listen();
      controller.onChange(function(value) {populateColony(); });
    f5.add(gs, 'strokeDisable').name('Stroke OFF');

  var controller =gui.add(gs, 'stepSize', 0, 100).name('Step Size').listen();
   controller.onChange(function(value) {if (gs.stepSize==0) {gs.stepped=false} else {gs.stepped=true; gs.trailMode = 3;};});

	var f7 = gui.addFolder("Nucleus");
    f7.add(gs, 'nucleus').name('Nucleus [N]').listen();
    f7.add(gs, 'stepSizeN', 0, 100).name('Step (nucleus)').listen();

  var f8 = gui.addFolder("StrainColors");
    var controller = f8.addColor(gs, 'strain0Fill').name('fillCol1').listen();
      //controller.onChange(function(value) {gs.bkgColor = color(value.h, value.s*255, value.v*255); background(gs.bkgColor);});
      controller.onChange(function(value) {colony.genepool[0].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
    if (gs.numStrains > 1) {
      var controller = f8.addColor(gs, 'strain1Fill').name('fillCol2').listen();
      controller.onChange(function(value) {colony.genepool[1].genes[0] = value.h; colony.genepool[1].genes[1] = value.s*255; colony.genepool[1].genes[2] =value.v*255; populateColony();});
    }
    if (gs.numStrains > 2) {
      var controller = f8.addColor(gs, 'strain2Fill').name('fillCol3').listen();
      controller.onChange(function(value) {colony.genepool[2].genes[0] = value.h; colony.genepool[2].genes[1] = value.s*255; colony.genepool[2].genes[2] =value.v*255; populateColony();});
    }

  //gui.add(gs, 'trailMode', { None: 1, Blend: 2, Continuous: 3} ).name('Trail Mode [1-2-3]');
  gui.add(gs, 'restart').name('Respawn [space]');
  gui.add(gs, 'randomRestart').name('Randomize [R]');
  gui.add(gs, 'autoRestart').name('Auto-restart');

  gui.close();
}


function randomizer() { // Parameters are randomized (more than in the initial configuration)
  //gs.colonySize = int(random (10,200));
  if (random(1) > 0.4) {gs.centerSpawn = true;} else {gs.centerSpawn = false;}

  gs.bkgColHSV = { h: random(360), s: random(), v: random() };
  gs.bkgColor = color(gs.bkgColHSV.h, gs.bkgColHSV.s*255, gs.bkgColHSV.v*255);

  if (random(1) > 0.5) {gs.fill_HTwist = floor(random(1, 360));} else {gs.fill_HTwist = 0;}
  if (random(1) > 0.5) {gs.fill_STwist = floor(random (1,255));} else {gs.fill_STwist = 0;}
  if (random(1) > 0.5) {gs.fill_BTwist = floor(random (1,255));} else {gs.fill_BTwist = 0;}
  if (random(1) > 0.5) {gs.fill_ATwist = floor(random (1,255));} else {gs.fill_ATwist = 0;}
  if (random(1) > 0.5) {gs.stroke_HTwist = floor(random(1, 360));} else {gs.stroke_HTwist = 0;}
  if (random(1) > 0.5) {gs.stroke_STwist = floor(random (1,255));} else {gs.stroke_STwist = 0;}
  if (random(1) > 0.5) {gs.stroke_BTwist = floor(random (1,255));} else {gs.stroke_BTwist = 0;}
  if (random(1) > 0.5) {gs.stroke_ATwist = floor(random (1,255));} else {gs.stroke_ATwist = 0;}

  if (random(1) > 0.7) {gs.nucleus = true;} else {gs.nucleus = false;}
  if (random(1) > 0.5) {gs.stepSize = int(random(20,60)); gs.stepSizeN = gs.stepSize;} else {gs.stepSize = 0; gs.stepSizeN = int(random(20, 50));}
  if (gs.stepSize==0) {gs.stepped=false} else {gs.stepped=true}
  gs.cellSSMax = random(1,250); // Absolute value
  gs.cellSSMin = random(1,250);  // Absolute value
  gs.cellESMax = random(100);  // % of cellStartSize
  gs.cellESMin = random(100);   // % of cellStartSize
  gs.lifespanMax = random(70);
  gs.lifespanMin = random(70);
  gs.noiseMax = random(100);
  gs.noiseMin = random(100);
  gs.spiralMin = random(-360,0);
  gs.spiralMax = random(360);
  gs.fill_H_Min = random(360);
  gs.fill_H_Max = random(360);
  gs.fill_S_Min = random(255);
  gs.fill_S_Max = random(255);
  gs.fill_B_Min = random(255);
  gs.fill_B_Max = random(255);
  gs.fill_A_Min = random(255);
  gs.fill_A_Max = random(255);
  gs.stroke_H_Min = random(360);
  gs.stroke_H_Max = random(360);
  gs.stroke_S_Min = random(255);
  gs.stroke_S_Max = random(255);
  gs.stroke_B_Min = random(255);
  gs.stroke_B_Max = random(255);
  gs.stroke_A_Min = random(255);
  gs.stroke_A_Max = random(255);
}
