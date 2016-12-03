// cell Class
function Cell(vel, dna) {

  //  Objects

  this.dna = dna;

  // DNA gene mapping (18 genes)
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

  // BOOLEAN
  this.fertile = false; // A new cell always starts of infertile

  // GROWTH & REPRODUCTION
  this.age = 0; // Age is 'number of frames since birth'. A new cell always starts with age = 0. From age comes maturity
  this.lifespan = this.dna.genes[10]; // Lifespan can be lowered by DNA but not increased
  this.fertility = this.dna.genes[13] * 0.01; // How soon will the cell become fertile?
  this.spawnCount = this.dna.genes[14]; // Max. number of spawns

  // SIZE AND SHAPE
  this.cellStartSize = this.dna.genes[8];
  this.cellEndSize = this.cellStartSize * this.dna.genes[9] * 0.01;
  //this.r = this.cellStartSize; // Initial value for radius
  this.flatness = this.dna.genes[11] * 0.01; // To make circles into ellipses. range 0.5 - 1.5
  this.growth = (this.cellStartSize-this.cellEndSize)/this.lifespan; // Should work for both large>small and small>large
  this.drawStep = 1;
  this.drawStepN = 1;

  // MOVEMENT
  //this.position = pos.copy(); //cell has position
  this.position =new p5.Vector(this.dna.genes[18], this.dna.genes[19]); //cell has position
  this.home = new p5.Vector(gs.homeX, gs.homeY); //cell has origin
  //this.range = 0;
  //this.remoteness = 0;

  this.velocityLinear = vel.copy(); //cell has unique basic velocity component
  this.noisePercent = this.dna.genes[17] * 0.01; // How much influence on velocity does Perlin noise have?
  this.spiral = this.dna.genes[12] * 0.01; // Spiral screw amount
  this.vMax = this.dna.genes[15]; // Maximum magnitude in velocity components generated by noise
  this.xoff = random(1000); //Seed for noise
  this.yoff = random(1000); //Seed for noise
  this.step = this.dna.genes[16] * 0.001; //Step-size for noise

  // COLOUR

  // FILL COLOR
  this.fill_H = this.dna.genes[0];
  this.fill_S = this.dna.genes[1];
  this.fill_B = this.dna.genes[2];
  this.fillColor = color(this.fill_H, this.fill_S, this.fill_B); // Initial color is set
  this.fillAlpha = this.dna.genes[3];

  //STROKE COLOR
  this.stroke_H = this.dna.genes[4];
  this.stroke_S = this.dna.genes[5];
  this.stroke_B = this.dna.genes[6];
  this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B); // Initial color is set
  this.strokeAlpha = this.dna.genes[7];

  this.run = function() {
    this.live();
    this.updatePosition();
    this.updateSize();
    this.updateFertility();
    this.updateColor();
    //if (gs.wraparound) {this.checkBoundaryWraparound();}
    this.display();
    if (gs.debug) {this.cellDebugger(); }
  }

  this.live = function() {
    this.age += 1;
    //this.maturity = map(this.age, 0, this.lifespan, 1, 0);
    this.drawStep--;
    this.drawStepStart = map(gs.stepSize, 0, 100, 0 , (this.r *2 + this.growth));
    if (this.drawStep < 0) {this.drawStep = this.drawStepStart;}
    this.drawStepN--;
    this.drawStepNStart = map(gs.stepSizeN, 0, 100, 0 , this.r *2);
    if (this.drawStepN < 0) {this.drawStepN = this.drawStepNStart;}
  }

  this.updatePosition = function() {
    var vx = map(noise(this.xoff), 0, 1, -this.vMax, this.vMax); // get new vx value from Perlin noise function
    var vy = map(noise(this.yoff), 0, 1, -this.vMax, this.vMax); // get new vy value from Perlin noise function
    var velocityNoise = createVector(vx, vy); // create new velocity vector based on new vx, vy components
    this.xoff += this.step; // increment x offset for next vx value
    this.yoff += this.step; // increment x offset for next vy value
    this.velocity = p5.Vector.lerp(this.velocityLinear, velocityNoise, this.noisePercent);
    var screwAngle = map(this.maturity, 0, 1, 0, this.spiral * TWO_PI); //swapped size with maturity
    //if (this.dna.genes[11] >= 0.5) {screwAngle *= -1;}
    this.velocity.rotate(screwAngle);
    this.position.add(this.velocity);
    //line(this.position.x, this.position.y, this.home.x, this.home.y);
    this.home = new p5.Vector(gs.homeX, gs.homeY);
    this.toHome = p5.Vector.sub(this.home, this.position); // static vector pointing from cell to home
    this.range = this.toHome.mag();
    this.remoteness = map(this.range, 0, this.lifespan, 0, 1);
    this.maturity = map(this.range, 0, this.lifespan, 1, 0);
  }

  this.updateSize = function() {
    //this.r = ((sin(map(this.maturity, 1, 0, 0, PI)))+0)*this.cellStartSize
    //this.r = ((cos(map(this.maturity, 1, 0, PI, PI*3)))+1)*this.cellStartSize
    //this.r -= this.growth;
    this.r = map(this.remoteness, 0, 1, this.cellStartSize, this.cellEndSize);
  }

  this.updateFertility = function() {
    if (this.maturity <= this.fertility) {this.fertile = true; } else {this.fertile = false; } // A cell is fertile if maturity is within limit (a % of lifespan)
    if (this.spawnCount == 0) {this.fertility = 0;} // Once spawnCount has counted down to zero, the cell will spawn no more
  }

  this.updateColor = function() {
    if (gs.fill_STwist > 0) {this.fill_S = map(this.maturity, 1, 0, (255-gs.fill_STwist), 255); this.fillColor = color(this.fill_H, this.fill_S, this.fill_B);} // Modulate fill saturation by radius
    if (gs.fill_BTwist > 0) {this.fill_B = map(this.maturity, 0, 1, (255-gs.fill_BTwist), 255); this.fillColor = color(this.fill_H, this.fill_S, this.fill_B);} // Modulate fill brightness by radius
    if (gs.fill_ATwist > 0) {this.fillAlpha = map(this.maturity, 0, 1, (255-gs.fill_ATwist), 255);} // Modulate fill Alpha by radius
    if (gs.fill_HTwist > 0) { // Modulate fill hue by radius. Does not change original hue value but replaces it with a 'twisted' version
      this.fill_Htwisted = map(this.maturity, 1, 0, this.fill_H, this.fill_H+gs.fill_HTwist);
      if (this.fill_Htwisted > 360) {this.fill_Htwisted -= 360;}
      this.fillColor = color(this.fill_Htwisted, this.fill_S, this.fill_B); //fill colour is updated with new hue value
    }
    if (gs.stroke_STwist > 0) {this.stroke_S = map(this.maturity, 1, 0, (255-gs.stroke_STwist), 255); this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B);} // Modulate stroke saturation by radius
    if (gs.stroke_BTwist > 0) {this.stroke_B = map(this.maturity, 0, 1, (255-gs.stroke_BTwist), 255); this.strokeColor = color(this.stroke_H, this.stroke_S, this.stroke_B);} // Modulate stroke brightness by radius
    if (gs.stroke_ATwist > 0) {this.strokeAlpha = map(this.maturity, 0, 1, (255-gs.stroke_ATwist), 255);} // Modulate stroke Alpha by radius
    if (gs.stroke_HTwist > 0) { // Modulate stroke hue by radius
      this.stroke_Htwisted = map(this.maturity, 1, 0, this.stroke_H, this.stroke_H+gs.stroke_HTwist);
      if (this.stroke_Htwisted > 360) {this.stroke_Htwisted -= 360;}
      this.strokeColor = color(this.stroke_Htwisted, this.stroke_S, this.stroke_B); //stroke colour is updated with new hue value
    }
  }

  //   this.checkBoundaryWraparound = function() {
  //   if (this.position.x > width + this.r*this.flatness) {
  //     this.position.x = -this.r*this.flatness;
  //   } else if (this.position.x < -this.r*this.flatness) {
  //     this.position.x = width + this.r*this.flatness;
  //   } else if (this.position.y > height + this.r*this.flatness) {
  //     this.position.y = -this.r*this.flatness;
  //   } else if (this.position.y < -this.r*this.flatness) {
  //     this.position.y = height + this.r*this.flatness;
  //   }
  // }

  // Cell Death
  this.dead = function() {
    //if (this.age >= this.lifespan) {return true;} // Death by old age (regardless of size, which may remain constant)
    if (this.r <= this.cellEndSize) {return true;} // Death by size (only when cell is shrinking)
    if (this.spawnCount <= 0) {return true;} // Death by too much babies
    if (this.position.x > width + this.r*this.flatness || this.position.x < -this.r*this.flatness || this.position.y > height + this.r*this.flatness || this.position.y < -this.r*this.flatness) {return true;} // Death if move beyond canvas boundary
    else {return false; }
  };

  this.display = function() {
    //strokeWeight(2);
    if (gs.strokeDisable) {noStroke();} else {stroke(hue(this.strokeColor), saturation(this.strokeColor), brightness(this.strokeColor), this.strokeAlpha);}
    if (gs.fillDisable) {noFill();} else {fill(hue(this.fillColor), saturation(this.fillColor), brightness(this.fillColor), this.fillAlpha);}

    var angle = this.velocity.heading();
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    if (!gs.stepped) { // No step-counter for Cell
      //line(-this.r,0,-this.r*2,0);
      ellipse(0, 0, this.r, this.r * this.flatness);

      if (gs.nucleus && this.drawStepN < 1) {
        if (this.fertile) {
          fill(gs.nucleusColorF); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
        else {
          fill(gs.nucleusColorU); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
      }
    }
    else if (this.drawStep < 1) { // stepped=true, step-counter is active for cell, draw only when counter=0
      ellipse(0, 0, this.r, this.r*this.flatness);
      if (gs.nucleus && this.drawStepN < 1) { // Nucleus is always drawn when cell is drawn (no step-counter for nucleus)
        if (this.fertile) {
          fill(gs.nucleusColorF); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
        else {
          fill(gs.nucleusColorU); ellipse(0, 0, this.cellEndSize, this.cellEndSize * this.flatness);
        }
      }
    }
    pop();
  };

  this.checkCollision = function(other) { // Method receives a Cell object 'other' to get the required info about the collidee
    var distVect = p5.Vector.sub(other.position, this.position); // Static vector to get distance between the cell & other
    var distMag = distVect.mag(); // calculate magnitude of the vector separating the balls
    if (distMag < (this.r + other.r)) {this.conception(other, distVect);} // Spawn a new cell
  }

  this.conception = function(other, distVect) {
    // Decrease spawn counters.
    this.spawnCount--;
    other.spawnCount--;

    // Calculate velocity vector for spawn as being roughly centered between parent cell & other
    var spawnVel = this.velocity.copy(); // Create spawnVel as a copy of parent cell's velocity vector
    spawnVel.add(other.velocity); // Add dad's velocity
    spawnVel.normalize(); // Normalize to leave just the direction and magnitude of 1 (will be multiplied later)

    // Combine the DNA of the parent cells
    var childDNA = this.dna.combine(other.dna);

    // Calculate new fill colour for child (a 50/50 blend of each parent cells)
    var childFillColor = lerpColor(this.fillColor, other.fillColor, 0.5);

    // Calculate new stroke colour for child (a 50/50 blend of each parent cells)
    var childStrokeColor = lerpColor(this.strokeColor, other.strokeColor, 0.5);

    // Genes for color require special treatment as I want childColor to be a 50/50 blend of parents colors
    // I will therefore overwrite color genes with reverse-engineered values after lerping:
    childDNA.genes[0] = hue(childFillColor); // Get the  lerped hue value and map it back to gene-range
    childDNA.genes[1] = saturation(childFillColor); // Get the  lerped hue value and map it back to gene-range
    childDNA.genes[2] = brightness(childFillColor); // Get the  lerped hue value and map it back to gene-range
    childDNA.genes[4] = hue(childStrokeColor); // Get the  lerped hue value and map it back to gene-range
    childDNA.genes[5] = saturation(childStrokeColor); // Get the  lerped hue value and map it back to gene-range
    childDNA.genes[6] = brightness(childStrokeColor); // Get the  lerped hue value and map it back to gene-range

    childDNA.genes[8] = (this.r + other.r) * 0.5; // Child cellStartSize is set at average of parents current radii

    childDNA.genes[18] = this.position.x; // Child starts at mother's current position
    childDNA.genes[19] = this.position.y; // Child starts at mother's current position

    childDNA.genes[20] = this.dna.genes[20]; // Child remembers origin of the mother
    childDNA.genes[21] = this.dna.genes[21]; // Child remembers origin of the mother
    //childDNA.mutate(0.01); // Child DNA can mutate. HACKED! Mutation is temporarily disabled!

    // Call spawn method (in Colony) with the new parameters for position, velocity, colour & starting radius)
    // Note: Currently no combining of parent DNA
    colony.spawn(spawnVel, childDNA);


    //Reduce fertility for parent cells by squaring them
    this.fertility *= this.fertility;
    this.fertile = false;
    other.fertility *= other.fertility;
    other.fertile = false;
  }

  this.cellDebugger = function() { // Displays cell parameters as text (for debug only)
    var rowHeight = 15;
    fill(0);
    textSize(rowHeight);
    // RADIUS
    //text("r:" + this.r, this.position.x, this.position.y + rowHeight*1);
    // text("cellStartSize:" + this.cellStartSize, this.position.x, this.position.y + rowHeight*0);
    // text("cellEndSize:" + this.cellEndSize, this.position.x, this.position.y + rowHeight*1);

    // COLOUR
    // text("fill_H:" + this.fill_H, this.position.x, this.position.y + rowHeight*2);
    //text("fill_Htw:" + this.fill_Htwisted, this.position.x, this.position.y + rowHeight*5);
    //text("fill_S:" + this.fill_S, this.position.x, this.position.y + rowHeight*6);
    //text("fill_B:" + this.fill_B, this.position.x, this.position.y + rowHeight*7);
    //text("this.fillCol:" + this.fillColor, this.position.x, this.position.y + rowHeight*2);
    //text("this.fillAlpha:" + this.fillAlpha, this.position.x, this.position.y + rowHeight*3);
    //text("this.fillCol (hue):" + hue(this.fillColor), this.position.x, this.position.y + rowHeight*2);
    //text("this.strokeCol:" + this.strokeColor, this.position.x, this.position.y + rowHeight*4);
    //text("this.strokeAlpha:" + this.strokeAlpha, this.position.x, this.position.y + rowHeight*5);

    // GROWTH
    //text("growth:" + this.growth, this.position.x, this.position.y + rowHeight*5);
    //text("maturity:" + this.maturity, this.position.x, this.position.y + rowHeight*5);
    //text("lifespan:" + this.lifespan, this.position.x, this.position.y + rowHeight*4);
    //text("remoteness:" + this.remoteness, this.position.x, this.position.y + rowHeight*2);
    //text("range:" + this.range, this.position.x, this.position.y + rowHeight*3);
    //text("age:" + this.age, this.position.x, this.position.y + rowHeight*3);
    //text("fertility:" + this.fertility, this.position.x, this.position.y + rowHeight*4);
    //text("fertile:" + this.fertile, this.position.x, this.position.y + rowHeight*3);
    //text("spawnCount:" + this.spawnCount, this.position.x, this.position.y + rowHeight*4);

    // MOVEMENT
    //text("vel.x:" + this.velocity.x, this.position.x, this.position.y + rowHeight*4);
    //text("vel.y:" + this.velocity.y, this.position.x, this.position.y + rowHeight*5);
    //text("vel.heading():" + this.velocity.heading(), this.position.x, this.position.y + rowHeight*3);
    //text("Noise%:" + this.noisePercent, this.position.x, this.position.y + rowHeight*1);
    //text("screw amount:" + gs.spiral, this.position.x, this.position.y + rowHeight*2);

    // DNA
    text("gene [0]:" + this.dna.genes[0], this.position.x, this.position.y + rowHeight*0);
    text("gene [1]:" + this.dna.genes[1], this.position.x, this.position.y + rowHeight*1);
    text("gene [2]:" + this.dna.genes[2], this.position.x, this.position.y + rowHeight*2);
  }

}
