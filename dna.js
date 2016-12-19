// DNA class
// This is based upon the original 'Nature of Code' example 'Evolution EcoSystem'
// by Daniel Shiffman <http://www.shiffman.net>

var numGenes = 20

// DNA gene mapping (20 genes)
// 0 = fill Hue           (0-360)         gs.strainNFill.h
// 1 = fill Saturation    (0-255)         gs.strainNFill.s * 255
// 2 = fill Brightness    (0-255)         gs.strainNFill.v * 255
// 3 = fill Alpha         (0-255)         gs.fill_A
// 4 = stroke Hue         (0-360)         gs.strainNStroke.h
// 5 = stroke Saturation  (0-255)         gs.strainNStroke.s * 255
// 6 = stroke Brightness  (0-255)         gs.strainNStroke.v * 255
// 7 = stroke Alpha       (0-255)         gs.stroke_A
// 8 = cellStartSize      (1-25% height)  gs.cellSSMax
// 9 = cellEndSize        (1-100% cellSS) gs.cellESMax
// 10 = lifespan          (1-100% height) gs.lifespanMax
// 11 = flatness          (100-200%)      gs.flatnessMax
// 12 = spiral screw      (0-180 deg)     gs.spiralMax
// 13 = fertility         (0-90%)         gs.fertility
// 14 = spawnCount        (1-5)           gs.spawnCount
// 15 = vMax (Noise)      (0-4)
// 16 = step (Noise)      (1-6 * 0.001)
// 17 = noisePercent      (0-100%)        gs.noiseMax
// 18 = seedPosX          (0-width)
// 19 = seedPosY          (0-height)

// 20 = originX           (0-width)       NOT IN USE HERE! replaced by gs.homeX
// 21 = originY           (0-height)      NOT IN USE HERE! replaced by gs.homeY

// Constructor (makes a random DNA with 20 genes)
function DNA(newgenes) {
  if (newgenes) {           // Tests to see if the function is called with a newgenes passed in or not:
    this.genes = newgenes;  // if it is, simply return a copy as this.genes
  }
  else {                    // if not, populate this.genes with 'numGenes' new genes
    this.genes = new Array(numGenes);

    this.genes[0] = 0;           // 0 = fill Hue (0-360)
    this.genes[1] = 0;           // 1 = fill Saturation (0-255)
    this.genes[2] = 0;           // 2 = fill Brightness (0-255)
    this.genes[3] = gs.fill_A;   // 3 = fill Alpha (0-255)

    this.genes[4] = 0;           // 4 = stroke Hue (0-360)
    this.genes[5] = 0;           // 5 = stroke Saturation (0-255)
    this.genes[6] = 0;           // 6 = stroke Brightness (0-255)
    this.genes[7] = gs.stroke_A; // 7 = stroke Alpha (0-255)

    this.genes[8] = int(gs.cellSSMax * (1-(random(gs.variance*0.01))) * 0.01 * height * 0.25); // 8 = cellStartSize
    this.genes[9] = gs.cellESMax * (1-(random(gs.variance*0.01)));                        // 9 = cellEndSize

    this.genes[10] = int(gs.lifespanMax * (1-(random(gs.variance*0.01))) * 0.01 * height);     // 10 = lifespan

    this.genes[11] = (gs.flatnessMax * (1-(random(gs.variance*0.01)))) + 100;             // 11 = flatness
    this.genes[12] = gs.spiralMax * (1-(random(gs.variance*0.01)));                       // 12 = spiral screw

    this.genes[13] = gs.fertility;   // 13 = fertility
    this.genes[14] = gs.spawnCount;  // 14 = spawnCount

    this.genes[15] = random(0, 4);   // 15 = vMax (Noise)
    this.genes[16] = random(1, 6);   // 16 = step (Noise)

    this.genes[17] = gs.noiseMax * (1-(random(gs.variance*0.01)))  // 17 = noisePercent (0-100%)

    if (gs.centerSpawn) {this.genes[18] = width*0.5;} else {this.genes[18] = random(-this.genes[10]*0.4, this.genes[10]*0.4) + (width * 0.5);}     // 18 = seedPosX (0-width)
    if (gs.centerSpawn) {this.genes[19] = height*0.5;} else {this.genes[19] = random(-this.genes[10]*0.4, this.genes[10]*0.4) + (height * 0.5);}  // 19 = seedPosY (0-height)
    //this.genes[20] = this.genes[18];         // 20 = originX (0-width)
    //this.genes[21] = this.genes[19];         // 21 = originY (0-width)
  }

  this.combine = function(otherDNA_) { // Returns a new set of DNA consisting of randomly selected genes from both parents
    var newgenes = []; // an empty array, ready to be populated
    for (var i = 0; i < this.genes.length; i++) { // Iterate through the entire DNA
      if (random() < 0.5) {newgenes[i] = this.genes[i];} else {newgenes[i] = otherDNA_.genes[i];} // 50/50 chance of copying gene from either 'mother' or 'other'
    }
    return new DNA(newgenes); // Calls the DNA constructor and passes in the newly populated newgenes array
  }

  // Based on a mutation probability 'm', picks a new random character in array spots
  // This original code can not be used in this form, since DNA are no longer in the range (0-1)
  this.mutate = function(m) {
    for (var i = 0; i < this.genes.length; i++) {
      if (random(1) < m) {
        this.genes[i] = random(0, 1);
      }
    }
  }

}
