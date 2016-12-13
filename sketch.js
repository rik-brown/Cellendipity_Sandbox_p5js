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
  // initGUI();
  initGUI_simple();
  background(gs.bkgColor);
  if (gs.debug) {frameRate(10);}
  colony = new Colony(gs.colonySize);
}

function draw() {
  noStroke();
  // fill(0, 255);
  // rect(0, 0, (width-height)*0.5, height);     // Left border
  // rect((width+height)*0.5, 0, width, height); // Right border
  if (gs.trailMode == 1 || gs.debug) {background(gs.bkgColor);}
  //if (gs.trailMode == 2) {trails();}
  if (!gs.paused) {colony.run();}
  // colony.run();
  if (colony.dead()) {if (keyIsPressed || gs.autoRestart) {populateColony(); } }
  //if (colony.colonyAge < 0) {populateColony(); }
  //if (colony.cells.length === 0 || colony.colonyAge < 0) {if (keyIsPressed || gs.autoRestart) {populateColony(); } } // Repopulate the colony when all the cells have died
  //if (colony.colonyAge < 0) {if (keyIsPressed || gs.autoRestart) {populateColony(); } } // Repopulate the colony when all the cells have died
}

function populateColony() {
  if (gs.randomizeOnRestart) {randomize();}
  background(gs.bkgColor); // Refresh the background
  if (gs.showInstructions) {instructions();}
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
  var dna = colony.genepool[floor(random(gs.numStrains))]; //get a random DNA from the genepool
  dna.genes[10] = height * 0.75; // workaround: overrides the Lifespan value for the strain to avoid spawning outside
  dna.genes[18] = mouseX;
  dna.genes[19] = mouseY;
  //gs.homeX = mouseX; // experiment to allow home to be moved around the screen
  //gs.homeY = mouseY; // experiment to allow home to be moved around the screen
  //if (mousePos.x < (width-270)) {colony.spawn(vel, dna);}
  if (mouseX > (width-height)*0.5 && mouseX < (width+height)*0.5) {colony.spawn(vel, dna);}
  colony.colonyAge = gs.colonyLifespan;
}

function mouseDragged() {
  var vel = p5.Vector.random2D();
  //var dna = new DNA(); // creates a new DNA with randomised values
  var dna = colony.genepool[floor(random(gs.numStrains))]; //get a random DNA from the genepool
  dna.genes[10] = height * 0.75; // workaround: overrides the Lifespan value for the strain to avoid spawning outside
  dna.genes[18] = mouseX;
  dna.genes[19] = mouseY;
  // gs.homeX = mouseX;
  // gs.homeY = mouseY;
  //if (mousePos.x < (width-270)) {colony.spawn(vel, dna);}
  if (mouseX > (width-height)*0.5 && mouseX < (width+height)*0.5) {colony.spawn(vel, dna);}
  colony.colonyAge = gs.colonyLifespan;
}

function screenDump() {
  saveCanvas('screendump.png', 'png');
}

function keyTyped() {
  if (key === 'd') {gs.debug = !gs.debug;} // D toggles 'cell debug' mode
  if (key === 'i') {gs.showInstructions = !gs.showInstructions; populateColony();} // I toggles 'show instructions' mode
  if (key === ' ') {populateColony();}  //spacebar respawns with current settings
  if (key === 'c') {gs.centerSpawn = !gs.centerSpawn; colony.cells = [];} // C toggles 'centered' mode
  if (key === 'n') {gs.nucleus = !gs.nucleus; populateColony();} // N toggles 'show nucleus' mode
  if (key === 's') {screenDump();} // S saves a screenshot
  if (key === 'r') {randomize(); populateColony();} // R for Randomize
  if (key === 'p') {gs.paused = !gs.paused;} // P toggles 'paused' mode
}

var initGUI = function () {
  var optionsMenu = gui.addFolder("Experiment");
  var controller = optionsMenu.add(gs, 'colonyLifespan', 100, 10000).step(100).name('Total duration').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = optionsMenu.add(gs, 'colonyDuration', 1, 100).step(1).name('Active duration%').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller =optionsMenu.add(gs, 'stepSize', 0, 100).name('Interval').listen();
  //  controller.onChange(function(value) {if (gs.stepSize==0) {gs.stepped=false} else {gs.stepped=true; gs.stepSizeN = gs.stepSize; gs.trailMode = 3;}; populateColony();});
   controller.onChange(function(value) {if (gs.stepSize > 0) {gs.stepSizeN = gs.stepSize;} populateColony();});
  var controller = optionsMenu.addColor(gs, 'bkgColHSV').name('Agar colour').listen();
    controller.onChange(function(value) {gs.bkgColor = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); updateHueAllStrains(); populateColony();});
  var controller = optionsMenu.add(gs, 'centerSpawn').name('Centered [C]').listen();
    controller.onChange(function(value) {populateColony(); });

  // optionsMenu.add(gs, 'autoRestart').name('Auto-restart');
  optionsMenu.add(gs, 'randomizeOnRestart').name('Random@restart');

  var seedMenu = gui.addFolder('Seed Cultures');
  var controller = seedMenu.add(gs, 'numStrains', 1, 5).step(1).name('Strains').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = seedMenu.add(gs, 'strainSize', 1, 40).step(1).name('Cells in strain').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = seedMenu.add(gs, 'colonyMaxSize', 10, 500).step(10).name('Cells (max)').listen();
	  controller.onChange(function(value) {populateColony(); });
  var controller = seedMenu.add(gs, 'variance', 0, 100).step(1).name('Diversity').listen();
    controller.onChange(function(value) {populateColony(); });

  var strain1Menu = gui.addFolder("Strain A");
    var controller = strain1Menu.addColor(gs, 'strain1Fill').name('Cytoplasm').listen();
      controller.onChange(function(value) {colony.genepool[0].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
    var controller = strain1Menu.add(gs, 'bkgHueFillOffset', 0, 360).step(1).name('Agar offset').listen();
      controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });
    var controller = strain1Menu.addColor(gs, 'strain1Stroke').name('Membrane').listen();
      controller.onChange(function(value) {colony.genepool[0].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
    var controller = strain1Menu.add(gs, 'bkgHueStrokeOffset', 0, 360).step(1).name('Agar offset').listen();
      controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });


    var strain2Menu = gui.addFolder("Strain B");
      var controller = strain2Menu.addColor(gs, 'strain2Fill').name('Cytoplasm').listen();
        controller.onChange(function(value) {colony.genepool[1].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
      var controller = strain2Menu.addColor(gs, 'strain2Stroke').name('Membrane').listen();
        controller.onChange(function(value) {colony.genepool[1].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});

      var strain3Menu = gui.addFolder("Strain C");
        var controller = strain3Menu.addColor(gs, 'strain3Fill').name('Cytoplasm').listen();
          controller.onChange(function(value) {colony.genepool[2].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
        var controller = strain3Menu.addColor(gs, 'strain3Stroke').name('Membrane').listen();
          controller.onChange(function(value) {colony.genepool[2].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});

        var strain4Menu = gui.addFolder("Strain D");
          var controller = strain4Menu.addColor(gs, 'strain4Fill').name('Cytoplasm').listen();
            controller.onChange(function(value) {colony.genepool[3].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
          var controller = strain4Menu.addColor(gs, 'strain4Stroke').name('Membrane').listen();
            controller.onChange(function(value) {colony.genepool[3].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});

        var strain5Menu = gui.addFolder("Strain E");
          var controller = strain5Menu.addColor(gs, 'strain5Fill').name('Cytoplasm').listen();
            controller.onChange(function(value) {colony.genepool[4].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
          var controller = strain5Menu.addColor(gs, 'strain5Stroke').name('Membrane').listen();
            controller.onChange(function(value) {colony.genepool[4].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});

	var fillColTweaksMenu = gui.addFolder("Cytoplasm mods");
    var controller = fillColTweaksMenu.add(gs, 'fill_HTwist', 0, 360).step(1).name('Hue').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = fillColTweaksMenu.add(gs, 'fill_STwist', 0, 255).name('Saturation').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = fillColTweaksMenu.add(gs, 'fill_BTwist', 0, 255).name('Brightness').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = fillColTweaksMenu.add(gs, 'fill_A', 0, 255).step(1).name('Transparency').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = fillColTweaksMenu.add(gs, 'strainHueFillOffset', 0, 100).step(1).name('Hue Offset').listen();
      controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });

    // var controller = fillColTweaksMenu.add(gs, 'fill_ATwist', 0, 255).name('AlphaMod.').listen();
    //   controller.onChange(function(value) {populateColony(); });
    // var controller = fillColTweaksMenu.add(gs, 'fill_A_Min', 0, 255).step(1).name('fillAMin').listen();
    //   controller.onChange(function(value) {populateColony(); });
    // var controller = fillColTweaksMenu.add(gs, 'fill_A_Max', 0, 255).step(1).name('fillAMax').listen();
    //   controller.onChange(function(value) {populateColony(); });

  var strokeColTweaksMenu = gui.addFolder("Membrane mods");
  	var controller = strokeColTweaksMenu.add(gs, 'stroke_HTwist', 0, 360).step(1).name('Hue').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = strokeColTweaksMenu.add(gs, 'stroke_STwist', 0, 255).name('Saturation').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = strokeColTweaksMenu.add(gs, 'stroke_BTwist', 0, 255).name('Brightness').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = strokeColTweaksMenu.add(gs, 'stroke_A', 0, 255).step(1).name('Transparency').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = strokeColTweaksMenu.add(gs, 'strainHueStrokeOffset', 0, 100).step(1).name('Hue Offset').listen();
      controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });

    // var controller = strokeColTweaksMenu.add(gs, 'stroke_ATwist', 0, 255).name('AlphaMod').listen();
    //   controller.onChange(function(value) {populateColony(); });
    // var controller = strokeColTweaksMenu.add(gs, 'stroke_A_Min', 0, 255).step(1).name('strokeAMin').listen();
    //   controller.onChange(function(value) {populateColony(); });
    // var controller = strokeColTweaksMenu.add(gs, 'stroke_A_Max', 0, 255).step(1).name('strokeAMax').listen();
    //   controller.onChange(function(value) {populateColony(); });

    var nucleusMenu = gui.addFolder("Nucleus mods");
      var controller = nucleusMenu.add(gs, 'nucleus').name('Show [N]').listen();
        controller.onChange(function(value) {populateColony(); });
      var controller = nucleusMenu.add(gs, 'stepSizeN', 0, 100).name('Step size').listen();
        controller.onChange(function(value) {populateColony(); });
      var controller = nucleusMenu.addColor(gs, 'nucleusColHSVU').name('Juvenile').listen();
        controller.onChange(function(value) {gs.nucleusColorU = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); populateColony();});
      var controller = nucleusMenu.addColor(gs, 'nucleusColHSVF').name('Adult').listen();
        controller.onChange(function(value) {gs.nucleusColorF = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); populateColony();});

      var dnaMenu = gui.addFolder("DNA mods");
      // var controller = dnaMenu.add(gs, 'cellSSMin', 1, 100).step(1).name('cellStartSizeMin').listen();
      //   controller.onChange(function(value) {populateColony(); });
      var controller = dnaMenu.add(gs, 'cellSSMax', 1, 100).step(1).name('Size (max)').listen();
        controller.onChange(function(value) {populateColony(); });
      // var controller = dnaMenu.add(gs, 'cellESMin', 1, 100).step(1).name('cellEndSizeMin').listen();
      //   controller.onChange(function(value) {populateColony(); });
      var controller = dnaMenu.add(gs, 'cellESMax', 1, 100).step(1).name('Size (min%)').listen();
        controller.onChange(function(value) {populateColony(); });
      // var controller = dnaMenu.add(gs, 'lifespanMin', 1, 100).step(1).name('lifespanMin').listen();
      //   controller.onChange(function(value) {populateColony(); });
      var controller = dnaMenu.add(gs, 'lifespanMax', 1, 100).step(1).name('Range').listen();
        controller.onChange(function(value) {populateColony(); });
      var controller = dnaMenu.add(gs, 'flatnessMax', 0, 100).step(1).name('Flatness').listen();
        controller.onChange(function(value) {populateColony(); });

      // var controller = dnaMenu.add(gs, 'noiseMin', 0, 100).step(1).name('noise%Min').listen();
      //   controller.onChange(function(value) {populateColony(); });
      var controller = dnaMenu.add(gs, 'noiseMax', 0, 100).step(1).name('Noise').listen();
        controller.onChange(function(value) {populateColony(); });
      // var controller = dnaMenu.add(gs, 'spiralMin', -360, 0).step(5).name('SpiralMinDegrees').listen();
      //   controller.onChange(function(value) {populateColony(); });
      var controller = dnaMenu.add(gs, 'spiralMax', 0, 360).step(5).name('Swirl').listen();
        controller.onChange(function(value) {populateColony(); });
      var controller = dnaMenu.add(gs, 'fertility', 0, 90).step(1).name('Fertility').listen();
        controller.onChange(function(value) {populateColony(); });
      var controller = dnaMenu.add(gs, 'spawnCount', 1, 5).step(1).name('Children').listen();
        controller.onChange(function(value) {populateColony(); });

      var colModsMenu = gui.addFolder("Colour mods");
      var controller = colModsMenu.add(gs, 'globalSaturation', 0, 100).step(1).name('Saturation%').listen();
        controller.onChange(function(value) {populateColony(); });
      var controller = colModsMenu.add(gs, 'globalBrightness', 0, 100).step(1).name('Brightness%').listen();
        controller.onChange(function(value) {populateColony(); });

  gui.add(gs, 'restart').name('Restart [space]').listen();
  gui.add(gs, 'restartRandomized').name('Randomize [R]').listen();
  gui.add(gs, 'paused').name('Pause [P]').listen();
  var controller = gui.add(gs, 'showInstructions').name('Instructions [ I ]').listen();
    controller.onChange(function(value) {populateColony(); });
  gui.add(gs, 'hide').name('Hide/show [H]');

  gui.close(); // GUI starts in closed state
}

function updateStrainAHue() { //update the gs.HSV color object for strain A so it shows correctly in the meny
  gs.strain1Fill.h = gs.bkgColHSV.h + gs.bkgHueFillOffset;
  gs.strain1Stroke.h = gs.bkgColHSV.h + gs.bkgHueStrokeOffset;
  if (gs.strain1Fill.h > 360) {gs.strain1Fill.h -= 360;}
  if (gs.strain1Stroke.h > 360) {gs.strain1Stroke.h -= 360;}
}

function updateHueAllStrains() { //update the gs.HSV color object for all strains
  gs.strain1Fill.h = gs.bkgColHSV.h + gs.bkgHueFillOffset;
  if (gs.strain1Fill.h > 360) {gs.strain1Fill.h -= 360;}

  gs.strain1Stroke.h = gs.bkgColHSV.h + gs.bkgHueStrokeOffset;
  if (gs.strain1Stroke.h > 360) {gs.strain1Stroke.h -= 360;}

  gs.strain2Fill.h = gs.strain1Fill.h + (gs.strainHueFillOffset * 3.6/gs.numStrains);
  if (gs.strain2Fill.h > 360) {gs.strain2Fill.h -= 360;}
  gs.strain3Fill.h = gs.strain2Fill.h + (gs.strainHueFillOffset * 3.6/gs.numStrains);
  if (gs.strain3Fill.h > 360) {gs.strain3Fill.h -= 360;}
  gs.strain4Fill.h = gs.strain3Fill.h + (gs.strainHueFillOffset * 3.6/gs.numStrains);
  if (gs.strain4Fill.h > 360) {gs.strain4Fill.h -= 360;}
  gs.strain5Fill.h = gs.strain4Fill.h + (gs.strainHueFillOffset * 3.6/gs.numStrains);
  if (gs.strain5Fill.h > 360) {gs.strain5Fill.h -= 360;}

  gs.strain2Stroke.h = gs.strain1Stroke.h + (gs.strainHueStrokeOffset * 3.6/gs.numStrains);
  if (gs.strain2Stroke.h > 360) {gs.strain2Stroke.h -= 360;}
  gs.strain3Stroke.h = gs.strain2Stroke.h + (gs.strainHueStrokeOffset * 3.6/gs.numStrains);
  if (gs.strain3Stroke.h > 360) {gs.strain3Stroke.h -= 360;}
  gs.strain4Stroke.h = gs.strain3Stroke.h + (gs.strainHueStrokeOffset * 3.6/gs.numStrains);
  if (gs.strain4Stroke.h > 360) {gs.strain4Stroke.h -= 360;}
  gs.strain5Stroke.h = gs.strain4Stroke.h + (gs.strainHueStrokeOffset * 3.6/gs.numStrains);
  if (gs.strain5Stroke.h > 360) {gs.strain5Stroke.h -= 360;}

}

function updateBrightAllStrains() { //update the gs.HSV color object for all strains
  gs.strain1Fill.b = gs.strain1Fill.b * gs.globalBrightness * 0.01;
  gs.strain2Fill.b = gs.strain2Fill.b * gs.globalBrightness * 0.01;
  gs.strain3Fill.b = gs.strain3Fill.b * gs.globalBrightness * 0.01;
  gs.strain4Fill.b = gs.strain4Fill.b * gs.globalBrightness * 0.01;
  gs.strain5Fill.b = gs.strain5Fill.b * gs.globalBrightness * 0.01;

  gs.strain1Stroke.b = gs.strain1Stroke.b * gs.globalBrightness * 0.01;
  gs.strain2Stroke.b = gs.strain1Stroke.b * gs.globalBrightness * 0.01;
  gs.strain3Stroke.b = gs.strain2Stroke.b * gs.globalBrightness * 0.01;
  gs.strain4Stroke.b = gs.strain3Stroke.b * gs.globalBrightness * 0.01;
  gs.strain5Stroke.b = gs.strain4Stroke.b * gs.globalBrightness * 0.01;
}

function updateSatAllStrains() { //update the gs.HSV color object for all strains
  gs.strain1Fill.s = gs.strain1Fill.s * gs.globalSaturation * 0.01;
  gs.strain2Fill.s = gs.strain2Fill.s * gs.globalSaturation * 0.01;
  gs.strain3Fill.s = gs.strain3Fill.s * gs.globalSaturation * 0.01;
  gs.strain4Fill.s = gs.strain4Fill.s * gs.globalSaturation * 0.01;
  gs.strain5Fill.s = gs.strain5Fill.s * gs.globalSaturation * 0.01;

  gs.strain1Stroke.s = gs.strain1Stroke.s * gs.globalSaturation * 0.01;
  gs.strain2Stroke.s = gs.strain1Stroke.s * gs.globalSaturation * 0.01;
  gs.strain3Stroke.s = gs.strain2Stroke.s * gs.globalSaturation * 0.01;
  gs.strain4Stroke.s = gs.strain3Stroke.s * gs.globalSaturation * 0.01;
  gs.strain5Stroke.s = gs.strain4Stroke.s * gs.globalSaturation * 0.01;
}



function randomize() { // Parameters are randomized (more than in the initial configuration)
  //optionsMenu---Experiment
  if (random(1) > 0.5) {gs.stepSize = int(random(20,60)); gs.stepSizeN = gs.stepSize;} else {gs.stepSize = 0; gs.stepSizeN = int(random(20, 50));}
  gs.bkgColHSV = { h: random(360), s: random(), v: random() };
  gs.bkgColor = color(gs.bkgColHSV.h, gs.bkgColHSV.s*255, gs.bkgColHSV.v*255);

  //seedMenu---Seed Cultures
  gs.numStrains = floor(random(1, 5));
  gs.strainSize = floor(random(1, 20)); // Number of cells in a strain
  gs.colonyMaxSize = random((gs.numStrains*gs.strainSize), 300);
  if (random(1) > 0.5) {gs.centerSpawn = true;} else {gs.centerSpawn = false;}

  gs.strain1Fill = { h: random(360), s: random(), v: random() };
  gs.strain2Fill = { h: random(360), s: random(), v: random() };
  gs.strain3Fill = { h: random(360), s: random(), v: random() };
  gs.strain4Fill = { h: random(360), s: random(), v: random() };
  gs.strain5Fill = { h: random(360), s: random(), v: random() };

  gs.strain1Stroke = { h: random(360), s: random(), v: random() };
  gs.strain2Stroke = { h: random(360), s: random(), v: random() };
  gs.strain3Stroke = { h: random(360), s: random(), v: random() };
  gs.strain4Stroke = { h: random(360), s: random(), v: random() };
  gs.strain5Stroke = { h: random(360), s: random(), v: random() };

  //fillColTweaksMenu---Cytoplasm mods
  if (random(1) > 0.5) {gs.fill_HTwist = floor(random(1, 360));} else {gs.fill_HTwist = 0;}
  if (random(1) > 0.5) {gs.fill_STwist = floor(random (1,255));} else {gs.fill_STwist = 0;}
  if (random(1) > 0.5) {gs.fill_BTwist = floor(random (1,255));} else {gs.fill_BTwist = 0;}
  if (random(1) > 0.5) {gs.fill_A = floor(random (1,255));} else {gs.fill_A = 0;}

  //strokeColTweaksMenu---Membrane mods
  if (random(1) > 0.5) {gs.stroke_HTwist = floor(random(1, 360));} else {gs.stroke_HTwist = 0;}
  if (random(1) > 0.5) {gs.stroke_STwist = floor(random (1,255));} else {gs.stroke_STwist = 0;}
  if (random(1) > 0.5) {gs.stroke_BTwist = floor(random (1,255));} else {gs.stroke_BTwist = 0;}
  if (random(1) > 0.5) {gs.stroke_A = floor(random (1,255));} else {gs.stroke_A = 0;}

  //nucleusMenu---Nucleus mods
  if (random(1) > 0.7) {gs.nucleus = true;} else {gs.nucleus = false;}
  gs.nucleusColHSVU = { h: random(360), s: random(), v: random() };
  gs.nucleusColorU = color(gs.nucleusColHSVU.h, gs.nucleusColHSVU.s*255, gs.nucleusColHSVU.v*255);
  gs.nucleusColHSVF = { h: random(360), s: random(), v: random() };
  gs.nucleusColorF = color(gs.nucleusColHSVF.h, gs.nucleusColHSVF.s*255, gs.nucleusColHSVF.v*255);

  //dnaMenu---Behavioral modifiers
  gs.variance = random(1);
  gs.cellSSMax = random(1,100); // Absolute value
  // gs.cellSSMin = random(1,100);  // Absolute value
  gs.cellESMax = random(100);  // % of cellStartSize
  // gs.cellESMin = random(100);   // % of cellStartSize
  gs.lifespanMax = random(30, 70);
  gs.lifespanMin = random(30, 70);
  gs.noiseMax = random(100);
  gs.noiseMin = random(100);
  gs.spiralMin = random(-360,0);
  gs.spiralMax = random(360);
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
  text("Share the cellular love,", 10, 426);
  text("tag your screenshots with #cellendipity", 10, 444);
  textStyle(BOLD);
  text("Contact: cellendipity@gmail.com", 10, 476);

  textSize(12);
  textStyle(NORMAL);
  text("© Richard Brown, December 9th 2016", 10, 500);
}

var initGUI_simple = function () {
  var optionsMenu = gui.addFolder("Experiment");
  var controller = optionsMenu.add(gs, 'colonyLifespan', 100, 10000).step(100).name('Total duration').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = optionsMenu.add(gs, 'colonyDuration', 1, 100).step(1).name('Active duration%').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller =optionsMenu.add(gs, 'stepSize', 0, 100).name('Interval').listen();
  //  controller.onChange(function(value) {if (gs.stepSize==0) {gs.stepped=false} else {gs.stepped=true; gs.stepSizeN = gs.stepSize; gs.trailMode = 3;}; populateColony();});
   controller.onChange(function(value) {if (gs.stepSize > 0) {gs.stepSizeN = gs.stepSize;} populateColony();});
  var controller = optionsMenu.add(gs, 'centerSpawn').name('Centered [C]').listen();
    controller.onChange(function(value) {populateColony(); });

  // optionsMenu.add(gs, 'autoRestart').name('Auto-restart');
  optionsMenu.add(gs, 'randomizeOnRestart').name('Random@restart');

  // var seedMenu = gui.addFolder('Seed Cultures');
  // var controller = seedMenu.add(gs, 'numStrains', 1, 5).step(1).name('Strains').listen();
	//   controller.onChange(function(value) {populateColony(); });
  // var controller = seedMenu.add(gs, 'strainSize', 1, 40).step(1).name('Cells in strain').listen();
  //   controller.onChange(function(value) {populateColony(); });
  // var controller = seedMenu.add(gs, 'colonyMaxSize', 10, 500).step(10).name('Cells (max)').listen();
	//   controller.onChange(function(value) {populateColony(); });
  // var controller = seedMenu.add(gs, 'variance', 0, 100).step(1).name('Diversity').listen();
  //   controller.onChange(function(value) {populateColony(); });
  //
  var colourBasicMenu = gui.addFolder("Colour");
  var controller = colourBasicMenu.addColor(gs, 'bkgColHSV').name('Background').listen();
    controller.onChange(function(value) {gs.bkgColor = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); updateHueAllStrains(); populateColony();});

  var controller = colourBasicMenu.add(gs, 'bkgHueFillOffset', 0, 360).step(1).name('Fill offset').listen();
    controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });
  var controller = colourBasicMenu.add(gs, 'bkgHueStrokeOffset', 0, 360).step(1).name('Outline offset').listen();
    controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });

  var controller = colourBasicMenu.addColor(gs, 'strain1Fill').name('Strain 1 fill').listen();
    controller.onChange(function(value) {colony.genepool[0].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain1Stroke').name('Strain 1 outline').listen();
    controller.onChange(function(value) {colony.genepool[0].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain2Fill').name('Strain 2 fill').listen();
    controller.onChange(function(value) {colony.genepool[1].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain2Stroke').name('Strain 2 outline').listen();
    controller.onChange(function(value) {colony.genepool[1].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain3Fill').name('Strain 3 fill').listen();
    controller.onChange(function(value) {colony.genepool[2].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain3Stroke').name('Strain 3 outline').listen();
    controller.onChange(function(value) {colony.genepool[2].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain4Fill').name('Strain 4 fill').listen();
    controller.onChange(function(value) {colony.genepool[3].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain4Stroke').name('Strain 4 outline').listen();
    controller.onChange(function(value) {colony.genepool[3].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain5Fill').name('Strain 5 fill').listen();
    controller.onChange(function(value) {colony.genepool[4].genes[0] = value.h; colony.genepool[0].genes[1] = value.s*255; colony.genepool[0].genes[2] =value.v*255; populateColony();});
  var controller = colourBasicMenu.addColor(gs, 'strain5Stroke').name('Strain 5 outline').listen();
    controller.onChange(function(value) {colony.genepool[4].genes[4] = value.h; colony.genepool[0].genes[5] = value.s*255; colony.genepool[0].genes[6] =value.v*255; populateColony();});
  var controller = colourBasicMenu.add(gs, 'strainHueFillOffset', 0, 100).step(1).name('Strain fill offset').listen();
    controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });
  var controller = colourBasicMenu.add(gs, 'strainHueStrokeOffset', 0, 100).step(1).name('Strain outline offset').listen();
    controller.onChange(function(value) {updateHueAllStrains(); populateColony(); });
  var controller = colourBasicMenu.add(gs, 'globalSaturation', 0, 100).step(1).name('Saturation%').listen();
    controller.onChange(function(value) {populateColony(); });
  var controller = colourBasicMenu.add(gs, 'globalBrightness', 0, 100).step(1).name('Brightness%').listen();
    controller.onChange(function(value) {populateColony(); });


	// var fillColTweaksMenu = gui.addFolder("Cytoplasm mods");
  //   var controller = fillColTweaksMenu.add(gs, 'fill_HTwist', 0, 360).step(1).name('Hue').listen();
  //     controller.onChange(function(value) {populateColony(); });
  //   var controller = fillColTweaksMenu.add(gs, 'fill_STwist', 0, 255).name('Saturation').listen();
  //     controller.onChange(function(value) {populateColony(); });
  //   var controller = fillColTweaksMenu.add(gs, 'fill_BTwist', 0, 255).name('Brightness').listen();
  //     controller.onChange(function(value) {populateColony(); });
  //   var controller = fillColTweaksMenu.add(gs, 'fill_A', 0, 255).step(1).name('Transparency').listen();
  //     controller.onChange(function(value) {populateColony(); });
  //
  //   // var controller = fillColTweaksMenu.add(gs, 'fill_ATwist', 0, 255).name('AlphaMod.').listen();
  //   //   controller.onChange(function(value) {populateColony(); });
  //   // var controller = fillColTweaksMenu.add(gs, 'fill_A_Min', 0, 255).step(1).name('fillAMin').listen();
  //   //   controller.onChange(function(value) {populateColony(); });
  //   // var controller = fillColTweaksMenu.add(gs, 'fill_A_Max', 0, 255).step(1).name('fillAMax').listen();
  //   //   controller.onChange(function(value) {populateColony(); });
  //
  // var strokeColTweaksMenu = gui.addFolder("Membrane mods");
  // 	var controller = strokeColTweaksMenu.add(gs, 'stroke_HTwist', 0, 360).step(1).name('Hue').listen();
  //     controller.onChange(function(value) {populateColony(); });
  //   var controller = strokeColTweaksMenu.add(gs, 'stroke_STwist', 0, 255).name('Saturation').listen();
  //     controller.onChange(function(value) {populateColony(); });
  //   var controller = strokeColTweaksMenu.add(gs, 'stroke_BTwist', 0, 255).name('Brightness').listen();
  //     controller.onChange(function(value) {populateColony(); });
  //   var controller = strokeColTweaksMenu.add(gs, 'stroke_A', 0, 255).step(1).name('Transparency').listen();
  //     controller.onChange(function(value) {populateColony(); });
  //
  //   // var controller = strokeColTweaksMenu.add(gs, 'stroke_ATwist', 0, 255).name('AlphaMod').listen();
  //   //   controller.onChange(function(value) {populateColony(); });
  //   // var controller = strokeColTweaksMenu.add(gs, 'stroke_A_Min', 0, 255).step(1).name('strokeAMin').listen();
  //   //   controller.onChange(function(value) {populateColony(); });
  //   // var controller = strokeColTweaksMenu.add(gs, 'stroke_A_Max', 0, 255).step(1).name('strokeAMax').listen();
  //   //   controller.onChange(function(value) {populateColony(); });
  //
  //   var nucleusMenu = gui.addFolder("Nucleus mods");
  //     var controller = nucleusMenu.add(gs, 'nucleus').name('Show [N]').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //     var controller = nucleusMenu.add(gs, 'stepSizeN', 0, 100).name('Step size').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //     var controller = nucleusMenu.addColor(gs, 'nucleusColHSVU').name('Juvenile').listen();
  //       controller.onChange(function(value) {gs.nucleusColorU = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); populateColony();});
  //     var controller = nucleusMenu.addColor(gs, 'nucleusColHSVF').name('Adult').listen();
  //       controller.onChange(function(value) {gs.nucleusColorF = color(value.h, value.s*255, value.v*255); background(gs.bkgColor); populateColony();});
  //
  //     var dnaMenu = gui.addFolder("DNA mods");
  //     // var controller = dnaMenu.add(gs, 'cellSSMin', 1, 100).step(1).name('cellStartSizeMin').listen();
  //     //   controller.onChange(function(value) {populateColony(); });
  //     var controller = dnaMenu.add(gs, 'cellSSMax', 1, 100).step(1).name('Size (max)').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //     // var controller = dnaMenu.add(gs, 'cellESMin', 1, 100).step(1).name('cellEndSizeMin').listen();
  //     //   controller.onChange(function(value) {populateColony(); });
  //     var controller = dnaMenu.add(gs, 'cellESMax', 1, 100).step(1).name('Size (min%)').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //     // var controller = dnaMenu.add(gs, 'lifespanMin', 1, 100).step(1).name('lifespanMin').listen();
  //     //   controller.onChange(function(value) {populateColony(); });
  //     var controller = dnaMenu.add(gs, 'lifespanMax', 1, 100).step(1).name('Range').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //     var controller = dnaMenu.add(gs, 'flatnessMax', 0, 100).step(1).name('Flatness').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //
  //     // var controller = dnaMenu.add(gs, 'noiseMin', 0, 100).step(1).name('noise%Min').listen();
  //     //   controller.onChange(function(value) {populateColony(); });
  //     var controller = dnaMenu.add(gs, 'noiseMax', 0, 100).step(1).name('Noise').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //     // var controller = dnaMenu.add(gs, 'spiralMin', -360, 0).step(5).name('SpiralMinDegrees').listen();
  //     //   controller.onChange(function(value) {populateColony(); });
  //     var controller = dnaMenu.add(gs, 'spiralMax', 0, 360).step(5).name('Swirl').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //     var controller = dnaMenu.add(gs, 'fertility', 0, 90).step(1).name('Fertility').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //     var controller = dnaMenu.add(gs, 'spawnCount', 1, 5).step(1).name('Children').listen();
  //       controller.onChange(function(value) {populateColony(); });
  //
  //     var colModsMenu = gui.addFolder("Colour mods");
  //
  // gui.add(gs, 'restart').name('Restart [space]').listen();
  // gui.add(gs, 'restartRandomized').name('Randomize [R]').listen();
  // gui.add(gs, 'paused').name('Pause [P]').listen();
  // var controller = gui.add(gs, 'showInstructions').name('Instructions [ I ]').listen();
  //   controller.onChange(function(value) {populateColony(); });
  // gui.add(gs, 'hide').name('Hide/show [H]');
  //
  gui.close(); // GUI starts in closed state
}
