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
  fill(0);
  rect(0, 0, width*0.25, height);     // Left border
  rect(width*0.75, 0, width, height); // Right border
  //if (gs.trailMode == 1 || gs.debug) {background(gs.bkgColor);}
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
  var mousePos = createVector(mouseX, mouseY);
  var vel = p5.Vector.random2D();
  var dna = new DNA();
  dna.genes[10] = height * 0.75;
  dna.genes[18] = mousePos.x;
  dna.genes[19] = mousePos.y;
  //if (mousePos.x < (width-270)) {colony.spawn(vel, dna);}
  if (mousePos.x > (width*0.25) || mousePos.x < (width*0.75)) {colony.spawn(vel, dna);}
}

function mouseDragged() {
  var mousePos = createVector(mouseX, mouseY);
  var vel = p5.Vector.random2D();
  var dna = new DNA();
  dna.genes[10] = height * 0.75;
  dna.genes[18] = mousePos.x;
  dna.genes[19] = mousePos.y;
  //if (mousePos.x < (width-270)) {colony.spawn(vel, dna);}
  if (mousePos.x > (width*0.25) || mousePos.x < (width*0.75)) {colony.spawn(vel, dna);}
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
	// var controller = gui.add(gs, 'colonySize', 1, 200).step(1).name('Colony Size').listen();
	//   controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'colonyLifespan', 500, 10000).step(500).name('MaxFrames').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'colonyDuration', 100, 5000).step(100).name('MaxActiveFrames').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'numStrains', 1, 10).step(1).name('Strains').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'strainSize', 1, 20).step(1).name('Cells in Strain').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'centerSpawn').name('Centered [C]').listen();
	  controller.onChange(function(value) {populateColony(); });

  var controller = gui.add(gs, 'cellSSMin', 1, 100).step(1).name('cellStartSizeMin').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'cellSSMax', 1, 250).step(1).name('cellStartSizeMax').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'cellESMin', 1, 100).step(1).name('cellEndSizeMin').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'cellESMax', 1, 100).step(1).name('cellEndSizeMax').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'lifespanMax', 1, 100).step(1).name('lifespanMin').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = gui.add(gs, 'lifespanMin', 1, 100).step(1).name('lifespanMax').listen();
    controller.onChange(function(value) {populateColony(); });

  var controller = gui.addColor(gs, 'bkgColHSV').name('Background color').listen();
    controller.onChange(function(value) {gs.bkgColor = color(value.h, value.s*255, value.v*255); background(gs.bkgColor);});

	var f3 = gui.addFolder("Fill Color Tweaks");
	  f3.add(gs, 'fill_HTwist', 0, 360).step(1).name('Hue').listen();
    f3.add(gs, 'fill_STwist', 0, 255).name('Saturation').listen();
    f3.add(gs, 'fill_BTwist', 0, 255).name('Brightness').listen();
    f3.add(gs, 'fill_ATwist', 0, 255).name('Alpha.').listen();
    f3.add(gs, 'fillDisable').name('Fill OFF');

  var f4 = gui.addFolder("Stroke Color Tweaks");
  	  f4.add(gs, 'stroke_HTwist', 0, 360).step(1).name('Hue').listen();
      f4.add(gs, 'stroke_STwist', 0, 255).name('Saturation').listen();
      f4.add(gs, 'stroke_BTwist', 0, 255).name('Brightness').listen();
      f4.add(gs, 'stroke_ATwist', 0, 255).name('Alpha').listen();
      f4.add(gs, 'strokeDisable').name('Stroke OFF');

  var controller =gui.add(gs, 'stepSize', 0, 100).name('Step Size').listen();
   controller.onChange(function(value) {if (gs.stepSize==0) {gs.stepped=false} else {gs.stepped=true; gs.trailMode = 3;};});

	var f7 = gui.addFolder("Nucleus");
    f7.add(gs, 'nucleus').name('Nucleus [N]').listen();
    f7.add(gs, 'stepSizeN', 0, 100).name('Step (nucleus)').listen();


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
}
