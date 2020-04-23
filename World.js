class World {
  constructor(size, scale, numOfLiving, numOfInfected = 0) {
    this.space = createMatrix(size.height, size.width);
    this.size = size;
    this.scale = scale;
    this.cells = [];
    this._deadIndex = 0;
    this.statistic = {
      todaysInfected: 0,
      dailyInfected: [numOfInfected]
    };
    this.generateRandomCells(numOfLiving, numOfInfected);
  }

  generateRandomCells(num, infected=0) {
    //const { width, height } = this.size;
    if (num >= this.size.width * this.size.height) {
      console.error('too much entity in the world');
    } else {
      for (let i = 0; i < num; i++) {
        let x, y, state = 1;
        do {
          x = Math.floor(random(this.size.width));
          y = Math.floor(random(this.size.height));
        } while (this.space[x][y] != 0);
        if (i < infected) {
          state = 2;
        }
        this.cells.push(new Cell(this.space, x, y, this.scale, state));
      }
    }
  }

  update() {
    for (const cell of this.cells) {
      if (random() > cell.laziness) {
        const r = Math.floor(random(4));
        if (cell.state > 0 && cell.checkNeighbor(r) == 0) {
          cell.move(r);
        }
      }
    }

    this.statistic.todaysInfected = 0;

    for (let i = this._deadIndex; i < this.cells.length; i++) {
      const cell = this.cells[i];
      cell.update(this.statistic);
      if (cell.state == 0) {
        this.cells[i] = this.cells[this._deadIndex];
        this.cells[this._deadIndex] = cell;
        this._deadIndex++;
      }
    }
    this.statistic.dailyInfected.push(this.statistic.todaysInfected);

    let infectedExist = false;
    for (let i = this._deadIndex; i < this.cells.length; i++) {
      const cell = this.cells[i];
      if (cell.state == 2) {
        infectedExist = true;
      }
    }
    if (!infectedExist) noLoop();
  }

  render() {
    const { size, scale } = this;
    push();
    fill(30);
    stroke(60);
    for (let i = 0; i < size.width; i++) {
      for (let j = 0; j < size.height; j++) {
        rect(i*scale, j*scale, scale-1, scale-1);
      }
    }
    noStroke();
    for (const cell of this.cells) {
      cell.render();
    }
    pop();
  }
  renderReport() {
    const pad = { x:20, y:20 };
    const report = this.statistic.dailyInfected;
    const graphWidth = this.size.width * this.scale - 2*pad.x;
    const graphHeight = 200 - 2*pad.y;
    const increment = graphWidth / (report.length - 1);
    const maxVal = Math.max.apply(null, report);
    push();
    translate(pad.x, pad.y + this.size.height * this.scale);

    textSize(10);
    textAlign(RIGHT, TOP);
    let satuan = graphHeight / maxVal;
    for (let i = 0; i <= maxVal; i++) {
      const y = i * satuan;
      noStroke();
      text(maxVal - i, -2, y);
      stroke(0, 80);
      line(0, y, graphWidth, y);
    }

    stroke(0);
    line(0, 0, 0, graphHeight);
    line(0, graphHeight, graphWidth, graphHeight);
    let v0 = map(report[0], 0, maxVal, 0, graphHeight);
    for (let i = 1; i < report.length; i++) {
      const v1 = map(report[i], 0, maxVal, 0, graphHeight);
      const x = increment * i;
      line(x-increment, graphHeight - v0, x, graphHeight - v1);
      v0 = v1;
    }
    noStroke();
    text('day ' + Global.day, graphWidth, graphHeight + 2);
    pop();
    push();
    translate(0, this.size.height * this.scale);
    textAlign(LEFT);
    textSize(8);
    fill(0, 80);
    text('Created by Jordi', 5, 196);
    pop();
  }
}