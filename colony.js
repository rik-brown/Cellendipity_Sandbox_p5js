// Colony class

// CONSTRUCTOR: Create a 'Colony' object, initially populated with 'colonySize' cells
function Colony() {
  // Start with an array for all cells and one for all DNA
  this.cells = [];
  this.genepool = [];

  // VARIABLES
  this.colonyAge = gs.colonyLifespan;
  this.maxStrains = 5;

  // This code  populates the 'genepool' arraylist with <maxStrains> different DNA-strains.
  for (var g = 0; g < this.maxStrains; g++) {
  this.genepool.push(new DNA()); // Add new DNA to the genepool. Individual genes will be generated within the limits in the constructor
  }
  // Now the genes for fillColor and strokeColor need to be overwritten according to the GUI settings.
  // This is a very messy solution! Needs replacing with a more efficient solution later....
  this.genepool[0].genes[0] = gs.strain1Fill.h;
  this.genepool[0].genes[1] = gs.strain1Fill.s * 255;
  this.genepool[0].genes[2] = gs.strain1Fill.v * 255;
  this.genepool[1].genes[0] = gs.strain2Fill.h;
  this.genepool[1].genes[1] = gs.strain2Fill.s * 255;
  this.genepool[1].genes[2] = gs.strain2Fill.v * 255;
  this.genepool[2].genes[0] = gs.strain3Fill.h;
  this.genepool[2].genes[1] = gs.strain3Fill.s * 255;
  this.genepool[2].genes[2] = gs.strain3Fill.v * 255;
  this.genepool[3].genes[0] = gs.strain4Fill.h;
  this.genepool[3].genes[1] = gs.strain4Fill.s * 255;
  this.genepool[3].genes[2] = gs.strain4Fill.v * 255;
  this.genepool[4].genes[0] = gs.strain5Fill.h;
  this.genepool[4].genes[1] = gs.strain5Fill.s * 255;
  this.genepool[4].genes[2] = gs.strain5Fill.v * 255;

  this.genepool[0].genes[4] = gs.strain1Stroke.h;
  this.genepool[0].genes[5] = gs.strain1Stroke.s * 255;
  this.genepool[0].genes[6] = gs.strain1Stroke.v * 255;
  this.genepool[1].genes[4] = gs.strain2Stroke.h;
  this.genepool[1].genes[5] = gs.strain2Stroke.s * 255;
  this.genepool[1].genes[6] = gs.strain2Stroke.v * 255;
  this.genepool[2].genes[4] = gs.strain3Stroke.h;
  this.genepool[2].genes[5] = gs.strain3Stroke.s * 255;
  this.genepool[2].genes[6] = gs.strain3Stroke.v * 255;
  this.genepool[3].genes[4] = gs.strain4Stroke.h;
  this.genepool[3].genes[5] = gs.strain4Stroke.s * 255;
  this.genepool[3].genes[6] = gs.strain4Stroke.v * 255;
  this.genepool[4].genes[4] = gs.strain5Stroke.h;
  this.genepool[4].genes[5] = gs.strain5Stroke.s * 255;
  this.genepool[4].genes[6] = gs.strain5Stroke.v * 255;

  // Create initial population of cells
  for (var i = 0; i < gs.numStrains; i++) {
    var dna = this.genepool[i]; // Get the corresponding dna from the genepool
    for (var j = 0; j < gs.strainSize; j++) { // Create a spawn of identical cells
      var vel = p5.Vector.random2D(); // Initial velocity vector is random
      this.cells.push(new Cell(vel, dna)); // Add new Cell with DNA
    }
  }

  this.spawn = function(vel, dna_) {
    // Spawn a new cell (called by e.g. MousePressed in main, accepting mouse coords for start position)
    this.cells.push(new Cell(vel, dna_));
  };

  // Colony Death
  this.dead = function() {
    if (this.colonyAge <= 0) {return true;}      // Death by old age
    if (this.cells.length === 0 ) {return true;} // Death by no living cells
    else {return false; }
  };

// Colony Inactive -  once the 'active' timer has expired
  this.inert = function() {
    if (this.colonyAge <= (gs.colonyLifespan-(gs.colonyLifespan * gs.colonyDuration * 0.01))) {return true;} // Duration has expired
    else {return false; }
  };

  // Run the colony
  this.run = function() {
    if (gs.debug) {this.colonyDebugger(); }
    this.colonyAge --;
    // Iterate backwards through the ArrayList because we are removing items
    for (var i = this.cells.length - 1; i >= 0; i--) {
      var c = this.cells[i];                    // Get one cell at a time
      if (!this.inert()) {c.run();}             // Run the cell (grow, move, spawn, check position vs boundaries etc.)
      if (c.dead()) {this.cells.splice(i, 1); } // If the cell has died, remove it from the array

      // Iteration to check for a collision-conception event between current cell(i) (if it's fertile) and the rest of the colony
      if (this.cells.length <= gs.colonyMaxSize && c.fertile) { // Don't check for collisons if there are too many cells (wait until some die off)
        for (var others = i - 1; others >= 0; others--) { // Since main iteration (i) goes backwards, this one needs to too
          var other = this.cells[others]; // Get the other cells, one by one
          if (other.fertile) {c.checkCollision(other);} // Only check for collisions when both cells are fertile
        }
      }
    }
  };

  this.colonyDebugger = function() { // Displays some values as text at the top left corner (for debug only)
    fill(0);
    rect(0,0,300,25);
    fill(360);
    textSize(16);
    text("Nr. cells: " + this.cells.length + " MaxLimit:" + gs.colonyMaxSize + " Age:" + this.colonyAge, 10, 18);
  };
}
