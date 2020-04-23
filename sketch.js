let world;

function setup() {
  const { initialInstance, initialInfected, size } = Global;
  let scale = Global.scale;
  if (scale == AUTO) {
    scale = autoScale();
  }
  createCanvas(size.width*scale, size.height*scale + 200);
  world = new World(size, scale, initialInstance, initialInfected);
  frameRate(Global.simSpeed);
}

function draw() {
  background(250, 230, 180);
  world.update();
  world.render();
  world.renderReport();
  Global.day++;
}