var element = document.getElementById("launch-background")
var app = new PIXI.Application({width: element.clientWidth, height: element.clientHeight, transparent: true});

function Point(x, y){
  this.x = x;
  this.y = y;
  this.dist = function(point){
    var change = this.sub(point)
    return Math.sqrt((change.x * change.x) + (change.y * change.y));
  }
  this.add = function(point){
    return new Point(this.x + point.x, this.y + point.y);
  }
  this.sub = function(point){
    return new Point(this.x - point.x, this.y - point.y);
  }
  this.scale = function(scalar){
    return new Point(this.x * scalar, this.y * scalar);
  }
}
var positions = [];
var velocities = [];
var masses = [];
var planets = [];
var trails = [];
var colors = [];
function update(delta){
  for(var i = 0; i<positions.length; i++){
    var currentForce = new Point(0, 0);
    for(var j = 0; j<positions.length; j++){
      if(i == j){
        continue;
      }
      currentForce = currentForce.add(positions[j].sub(positions[i]).scale(masses[j]/(Math.pow(positions[j].dist(positions[i]), 2))))
    }
    velocities[i] = velocities[i].add(currentForce)
  }
  for(var i = 0; i<velocities.length; i++){
    var deltaPos = velocities[i].scale(delta)
    positions[i] = positions[i].add(deltaPos)
    planets[i].x = positions[i].x + (element.clientWidth / 2)
    planets[i].y = positions[i].y + (element.clientHeight / 2)
  }

}
function setup(){
  positions = [new Point(-90, -90), new Point(-90, 90), new Point(120, 90)]
  velocities = [new Point(0, 0), new Point(0, 0), new Point(0, 0)];
  colors = [0x004400, 0xFF0000, 0x0000FF]
  masses = [3, 4, 5]
  for(var i = 0; i<positions.length; i++){
    var circle = new PIXI.Graphics();
    circle.beginFill(colors[i]);
    circle.drawCircle(0, 0, masses[i])
    circle.endFill()
    planets[i] = circle
    app.stage.addChild(circle)
  }
  element.appendChild(app.view)
  console.log(app.stage)
  app.renderer.autoResize = true;
}
setup()
app.ticker.add(delta => update(delta));

window.onresize = function(event){
  app.renderer.resize(element.clientWidth, element.clientHeight)
}
