// DNA class
// This is a copy from the original 'Nature of Code' example 'Evolution EcoSystem'
// by Daniel Shiffman <http://www.shiffman.net>
// NOTE: 'copy()' and 'mutate()' are not in use

var numGenes = 22

// DNA gene mapping (22 genes)
// 0 = fill Hue (0-360)
// 1 = fill Saturation (0-255)
// 2 = fill Brightness (0-255)
// 3 = fill Alpha (0-255)
// 4 = stroke Hue (0-360)
// 5 = stroke Saturation (0-255)
// 6 = stroke Brightness (0-255)
// 7 = stroke Alpha (0-255)
// 8 = cellStartSize (10-50) (cellendipity/one uses 0-200)
// 9 = cellEndSize (5 - 20 %) (cellendipity/one uses 0-50)
// 10 = lifespan (200-1000)
// 11 = flatness (50-200 %)
// 12 = spiral screw (-75 - +75 %)
// 13 = fertility (70-90%)
// 14 = spawnCount (1-5)
// 15 = vMax (Noise) (0-5) (cellendipity/one uses 0-4)
// 16 = step (Noise) (1 - 6 * 0.001?)  (cellendipity/one uses 0.001-0.006)
// 17 = noisePercent (0-100%)
// 18 = seedPosX (0-width)
// 19 = seedPosY (0-height)
// 20 = originX (0-width)
// 21 = originY (0-height)

// Constructor (makes a random DNA with 15 genes)
function DNA(newgenes) {
  if (newgenes) {           // Tests to see if the function is called with a newgenes passed in or not:
    this.genes = newgenes;  // if it is, simply return a copy as this.genes
  } else {                  // if not, populate this.genes with 'numGenes' new genes
    // The genetic sequence
    // DNA is random floating point values between 0 and 1
    this.genes = new Array(numGenes);

    this.genes[0] = random(360);        // 0 = fill Hue (0-360)
    this.genes[1] = random(128, 255);   // 1 = fill Saturation (0-255)
    this.genes[2] = random(196, 255);   // 2 = fill Brightness (0-255)
    this.genes[3] = 25;                 // 3 = fill Alpha (0-255)

    this.genes[4] = random(360);        // 4 = stroke Hue (0-360)
    this.genes[5] = random(255);        // 5 = stroke Saturation (0-255)
    this.genes[6] = random(255);        // 6 = stroke Brightness (0-255)
    this.genes[7] = 5;                  // 7 = stroke Alpha (0-255)

    this.genes[8] = random(width*0.05, width*0.12);    // 8 = cellStartSize (10-50) (cellendipity/one uses 0-200)
    this.genes[9] = random(5, 30);                     // 9 = cellEndSize (5 - 20 %) (cellendipity/one uses 0-50)

    this.genes[10] = random(width*0.3,  width*0.6);                               // 10 = lifespan (200-1000)
    if (random(1)>0.5) {this.genes[11] = 100;} else {this.genes[11] = random(75, 150);} // 11 = flatness (50-200 %)
    if (random(1)>0.6) {this.genes[12] = 0;} else {this.genes[12] = random(-75, 75);}   // 12 = spiral screw (-75 - +75 %)
    this.genes[13] = 75;                                                           // 13 = fertility (70-90%)
    this.genes[14] = 3;                                                            // 14 = spawnCount (1-5)

    this.genes[15] = random(0, 4);      // 15 = vMax (Noise) (0-5) (cellendipity/one uses 0-4)
    this.genes[16] = random(1, 6);      // 16 = step (Noise) (1 - 6 * 0.001?)  (cellendipity/one uses 0.001-0.006)
    this.genes[17] = random(100);       // 17 = noisePercent (0-100%)
    if (gs.centerSpawn) {this.genes[18] = width/2;} else {this.genes[18] = random(width*0.5) + (width * 0.25);}     // 18 = seedPosX (0-width)
    if (gs.centerSpawn) {this.genes[19] = height/2;} else {this.genes[19] = random(height*0.5) + (height * 0.25);}  // 19 = seedPosY (0-height)
    this.genes[20] = this.genes[18];         // 20 = originX (0-width)
    this.genes[21] = this.genes[19];         // 21 = originY (0-width)
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
