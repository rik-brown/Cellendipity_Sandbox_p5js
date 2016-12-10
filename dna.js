// DNA class
// This is a copy from the original 'Nature of Code' example 'Evolution EcoSystem'
// by Daniel Shiffman <http://www.shiffman.net>
// NOTE: 'copy()' and 'mutate()' are not in use

var numGenes = 20

// DNA gene mapping (22 genes)
// 0 = fill Hue (0-360)             gs.strainNFill.h
// 1 = fill Saturation (0-255)      gs.strainNFill.s * 255
// 2 = fill Brightness (0-255)      gs.strainNFill.v * 255
// 3 = fill Alpha (0-255)           gs.fill_A
// 4 = stroke Hue (0-360)           gs.strainNStroke.h
// 5 = stroke Saturation (0-255)    gs.strainNStroke.s * 255
// 6 = stroke Brightness (0-255)    gs.strainNStroke.v * 255
// 7 = stroke Alpha (0-255)         gs.stroke_A

// 8 = cellStartSize (1-100)        gs.cellSSMin / gs.cellSSMax WARNING! Should be relative to window size, not absolute, or???
// 9 = cellEndSize (1-100% cellSS)  gs.cellESMin / gs.cellESMax
// 10 = lifespan (1-100% height)    gs.lifespanMin / gs.lifespanMax
// 11 = flatness (75-150%)
// 12 = spiral screw (-360/+360)    gs.spiralMin / gs.spiralMax
// 13 = fertility (70-90%)(75)
// 14 = spawnCount (1-5)(3)
// 15 = vMax (Noise) (0-4)
// 16 = step (Noise) (1-6 * 0.001)
// 17 = noisePercent (0-100%)       gs.noiseMin / gs.noiseMax
// 18 = seedPosX (0-width)
// 19 = seedPosY (0-height)
// 20 = originX (0-width)           NOT IN USE HERE! replaced by gs.homeX
// 21 = originY (0-height)          NOT IN USE HERE! replaced by gs.homeY

// Constructor (makes a random DNA with 22 genes)
function DNA(newgenes) {
  if (newgenes) {           // Tests to see if the function is called with a newgenes passed in or not:
    this.genes = newgenes;  // if it is, simply return a copy as this.genes
  }
  else {                  // if not, populate this.genes with 'numGenes' new genes
    this.genes = new Array(numGenes);

    this.genes[0] = random(gs.fill_H_Min, gs.fill_H_Max);        // 0 = fill Hue (0-360)
    this.genes[1] = random(gs.fill_S_Min, gs.fill_S_Max);        // 1 = fill Saturation (0-255)
    this.genes[2] = random(gs.fill_B_Min, gs.fill_B_Max);        // 2 = fill Brightness (0-255)
    //this.genes[3] = random(gs.fill_A_Min, gs.fill_A_Max);
    this.genes[3] = gs.fill_A;                                   // 3 = fill Alpha (0-255)

    this.genes[4] = random(gs.stroke_H_Min, gs.stroke_H_Max);    // 4 = stroke Hue (0-360)
    this.genes[5] = random(gs.stroke_S_Min, gs.stroke_S_Max);    // 5 = stroke Saturation (0-255)
    this.genes[6] = random(gs.stroke_B_Min, gs.stroke_B_Max);    // 6 = stroke Brightness (0-255)
    //this.genes[7] = random(gs.stroke_A_Min, gs.stroke_A_Max);
    this.genes[7] = gs.stroke_A;                                 // 7 = stroke Alpha (0-255)

    //this.genes[8] = random(height*0.05, height*0.12);                   // 8 = cellStartSize (10-50)  (cellendipity/one uses 0-200)
    //this.genes[8] = random(gs.cellSSMin, gs.cellSSMax) * 0.01 * height; // 8 = cellStartSize (10-50)  (cellendipity/one uses 0-200)
    this.genes[8] = random(gs.cellSSMin, gs.cellSSMax);                   // 8 = cellStartSize (1-100)  (cellendipity/one uses 0-200)
    this.genes[9] = random(gs.cellESMin, gs.cellESMax);                   // 9 = cellEndSize   (1-100%) (cellendipity/one uses 0-50)

    //this.genes[10] = random(height*0.3,  height*0.7);                          // 10 = lifespan (200-1000)
    this.genes[10] = random(gs.lifespanMin,  gs.lifespanMax) * 0.01 * height;    // 10 = lifespan (200-1000)

    if (random(1)>0.5) {this.genes[11] = 100;} else {this.genes[11] = random(75, 150);} // 11 = flatness (75-150 %)
    if (random(1)>0.6) {this.genes[12] = 0;} else {this.genes[12] = random(gs.spiralMin, gs.spiralMax);}   // 12 = spiral screw (-75 - +75 %)
    this.genes[13] = 75;                                                           // 13 = fertility (70-90%)
    this.genes[14] = 3;                                                            // 14 = spawnCount (1-5)

    this.genes[15] = random(0, 4);      // 15 = vMax (Noise) (0-5) (cellendipity/one uses 0-4)
    this.genes[16] = random(1, 6);      // 16 = step (Noise) (1 - 6 * 0.001?)  (cellendipity/one uses 0.001-0.006)
    this.genes[17] = random(gs.noiseMin, gs.noiseMax);       // 17 = noisePercent (0-100%)
    if (gs.centerSpawn) {this.genes[18] = width*0.5;} else {this.genes[18] = random(-this.genes[10]*0.4, this.genes[10]*0.4) + (width * 0.5);}     // 18 = seedPosX (0-width)
    if (gs.centerSpawn) {this.genes[19] = height*0.5;} else {this.genes[19] = random(-this.genes[10]*0.4, this.genes[10]*0.4) + (height * 0.5);}  // 19 = seedPosY (0-height)
    //this.genes[20] = this.genes[18];         // 20 = originX (0-width)
    //this.genes[21] = this.genes[19];         // 21 = originY (0-width)
  }

  this.combine = function(otherDNA_) { // Returns a new set of DNA consisting of randomly selected genes from both parents
    var newgenes = []; // an empty array, ready to be populated
    for (var i = 0; i < this.genes.length; i++) { // iterate through the entire DNA
      if (random() < 0.5) {newgenes[i] = this.genes[i];} else {newgenes[i] = otherDNA_.genes[i];} // 50/50 chance of copying gene from either 'mother' or 'other'
    }
    return new DNA(newgenes); // Calls the DNA constructor and passes in the newly populated newgenes array
  }

  // Based on a mutation probability 'm', picks a new random character in array spots
  this.mutate = function(m) {
    for (var i = 0; i < this.genes.length; i++) {
      if (random(1) < m) {
        this.genes[i] = random(0, 1);
      }
    }
  }

}
