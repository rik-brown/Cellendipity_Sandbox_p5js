// Colony class

// CONSTRUCTOR: Create a 'Colony' object, initially populated with 'colonySize' cells
function Colony(colonySize) {
  // Start with an array for all cells and one for all DNA
  this.cells = [];
  //this.genepool = []; //Do I need a genepool??

  // VARIABLES
  var colonyMaxSize = 200; // This could be varied in the GUI but 200 is copied from .pde
  this.colonyAge = gs.colonyLifespan;

  // Here is the code which fills the 'genepool' arraylist with a given number (gs.numStrains) of different DNA-strains.
  //for (var g = 0; g < gs.numStrains; g++) {
  //this.genepool.push(new DNA()); // Add new Cell with DNA
  //}

  // Create initial population of cells
  //var strainSize = floor(gs.colonySize/gs.numStrains);
  for (var i = 0; i < gs.numStrains; i++) {
    var dna = new DNA(); // Get new DNA
    if (i == 0) {dna.genes[1] = 255; dna.genes[2] = 0;} else {dna.genes[1] = 0; dna.genes[2] = 255;}
    for (var j = 0; j < gs.strainSize; j++) {
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
    if (this.colonyAge <= 0) {return true;} // Death by old age
    if (this.cells.length === 0 ) {return true;} // Death by no living cells
    else {return false; }
  };

  this.inert = function() {
    if (this.colonyAge <= (gs.colonyLifespan-gs.colonyDuration)) {return true;} // Duration has expired
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
      if (this.cells.length <= colonyMaxSize && c.fertile) { // Don't check for collisons if there are too many cells (wait until some die off)
        for (var others = i - 1; others >= 0; others--) { // Since main iteration (i) goes backwards, this one needs to too
          var other = this.cells[others]; // Get the other cells, one by one
          if (other.fertile) {c.checkCollision(other);} // Only check for collisions when both cells are fertile
        }
      }
    }
  };

  this.colonyDebugger = function() { // Displays some values as text at the top left corner (for debug only)
    fill(0);
    rect(0,0,300,20);
    fill(360);
    textSize(16);
    text("Nr. cells: " + this.cells.length + " MaxLimit:" + colonyMaxSize + " Age:" + this.colonyAge, 10, 18);
  };
}
