class Cell {
  constructor(spaceInstance, x, y, scale, state = 1) {
    /* state = enum [dead, normal, infected, immune] */
    const { immuneMean, immuneStd, lazinessMean, lazinessStd } = Global;
    this.pos = createVector(x, y);
    this.scale = scale;
    this.spaceIns = spaceInstance;
    this.spaceSize = {
      width: spaceInstance.length,
      height: spaceInstance[0].length
    };
    this.state = state;
    if (state == 2) this.becomeInfected();
    this.immunity = constrain(randomGaussian(immuneMean, immuneStd), 0, 1);
    this.laziness = constrain(randomGaussian(lazinessMean,lazinessStd),0, 1);
    this.write();
  }
  write(state = null) {
    if (state == null) state = this.state;
    const {x, y} = this.pos;
    this.spaceIns[x][y] = state;
  }
  move(dir) {
    /* dir = enum [up, right, down, left] */
    const { pos } = this;
    const size = this.spaceSize;
    this.write(0);
    switch(dir) {
      case 0:
        pos.y = (pos.y + size.height - 1) % size.height; break;
      case 1:
        pos.x = (pos.x + size.width + 1) % size.width; break;
      case 2:
        pos.y = (pos.y + size.height + 1) % size.height; break;
      case 3:
        pos.x = (pos.x + size.width - 1) % size.width; break;
    }
    this.write();
  }
  checkNeighbor(dir) {
    /* dir = enum [up, right, down, left] */
    const { pos } = this;
    const size = this.spaceSize;
    let { x, y } = pos;
    switch(dir) {
      case 0:
        y = (pos.y + size.height - 1) % size.height; break;
      case 1:
        x = (pos.x + size.width + 1) % size.width; break;
      case 2:
        y = (pos.y + size.height + 1) % size.height; break;
      case 3:
        x = (pos.x + size.width - 1) % size.width; break;
    }
    return this.spaceIns[x][y];
  }
  becomeInfected() {
    const { virusIncubationDayMean, virusIncubationDayStd } = Global;
    this.state = 2;
    this.infectedDay = Global.day;
    this.virusIncubationDay = randomGaussian(
      virusIncubationDayMean,
      virusIncubationDayStd
    );
    this.write();
  }
  update(stat = null) {
    if (this.state == 1) {
      for (let dir = 0; dir < 4; dir++) {
        if (this.checkNeighbor(dir) == 2) {
          this.becomeInfected();
          if (stat) stat.todaysInfected++;
          break;
        }
      }
    } else if (this.state == 2) {
      const age = Global.day - this.infectedDay;
      if (
        age > this.virusIncubationDay &&
        random() < 2*(sigmoid(this.immunity * age) - .5)
      ) {
        this.state = 0;
        this.write();
      } else if (random() < Global.cureRate) {
        this.state = 3;
        this.write();
      }
    }
  }
  render() {
    const {x, y} = this.pos;
    const scale = this.scale;
    push();
    switch(this.state) {
      case 1:
        fill(200); break;
      case 2:
        fill(180, 0, 200); break;
      case 3:
        fill(200, 220, 0); break;
      default:
        fill(255, 0, 0, 100);
    }
    ellipse(scale * (x + .5), scale * (y + .5), scale-1, scale-1);
    pop();
  }
}