var element = document.getElementById("launch-background")
var app = new PIXI.Application({width: element.clientWidth, height: element.clientHeight, antialias: true, transparent: true});

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
      var dist = positions[j].dist(positions[i])
      if(dist <= 1){
        //They're super close, so they'll probably rocket apart. For the sake of making it look cool, just ignore it this round.
        continue;
      }
      currentForce = currentForce.add(positions[j].sub(positions[i]).scale(masses[j]/(Math.pow(dist, 2))))
    }
    velocities[i] = velocities[i].add(currentForce)
  }
  for(var i = 0; i<velocities.length; i++){
    var previous = new Point(planets[i].x, planets[i].y);
    var deltaPos = velocities[i].scale(delta)
    positions[i] = positions[i].add(deltaPos)
    planets[i].x = positions[i].x + (element.clientWidth / 2)
    planets[i].y = positions[i].y + (element.clientHeight / 2)
    var line = new PIXI.Graphics();
    line.lineStyle(4, colors[i]/2, 1);
    line.moveTo(0, 0);
    line.lineTo(deltaPos.x, deltaPos.y);
    line.x = previous.x;
    line.y = previous.y;
    app.stage.addChild(line);
    trails.push(line);
    if(trails.length > 1000){
      app.stage.removeChild(trails.shift());
    }
  }
  for(var i = 0; i<trails.length; i++){
    trails[i].alpha -= 0.003;
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
    circle.drawCircle(0, 0, masses[i]*2)
    circle.endFill()
    planets[i] = circle
    app.stage.addChild(circle)
  }
  element.appendChild(app.view)
  app.renderer.autoResize = true;
}
setup()
app.ticker.add(delta => update(delta));

window.onresize = function(event){
  for(var i = 0; i<trails.length; i++){ //Clear trails or else they'll ook broken and weird.
    app.stage.removeChild(trails[i])
  }
  app.renderer.resize(element.clientWidth, element.clientHeight)
}
