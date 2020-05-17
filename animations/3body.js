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

class ThreeBody extends Animation{
  constructor(){
    super();  
    this.positions = [];
    this.velocities = [];
    this.masses = [];
    this.planets = [];
    this.trails = [];
    this.colors = [];
  }
  update(delta){
    for(var i = 0; i<this.positions.length; i++){
      var currentForce = new Point(0, 0);
      for(var j = 0; j<this.positions.length; j++){
        if(i == j){
          continue;
        }
        var dist = this.positions[j].dist(this.positions[i])
        if(dist <= 1){
          //They're super close, so they'll probably rocket apart. For the sake of making it look cool, just ignore it this round.
          continue;
        }
        currentForce = currentForce.add(this.positions[j].sub(this.positions[i]).scale(this.masses[j]/(Math.pow(dist, 2))))
      }
      this.velocities[i] = this.velocities[i].add(currentForce)
    }
    for(var i = 0; i<this.velocities.length; i++){
      var previous = new Point(this.planets[i].x, this.planets[i].y);
      var deltaPos = this.velocities[i].scale(delta)
      this.positions[i] = this.positions[i].add(deltaPos)
      this.planets[i].x = this.positions[i].x + (this.element.clientWidth / 2)
      this.planets[i].y = this.positions[i].y + (this.element.clientHeight / 2)
      var line = new PIXI.Graphics();
      line.lineStyle(4, this.colors[i]/2, 1);
      line.moveTo(0, 0);
      line.lineTo(deltaPos.x, deltaPos.y);
      line.x = previous.x;
      line.y = previous.y;
      this.app.stage.addChild(line);
      this.trails.push(line);
      if(this.trails.length > 1000){
        this.app.stage.removeChild(this.trails.shift());
      }
    }
    for(var i = 0; i<this.trails.length; i++){
      this.trails[i].alpha -= 0.003;
    }
  
  }
  generatePoints() {
    var points = []
    var gAngle = Math.PI * (3 - Math.sqrt(5))
    var variance = Math.PI / 3
    var lastAngle = 0
    var radius = 120;
    for(var i = 0; i<3; i++){
      var rand = (Math.random() - 0.5) * 2 //Between -1 and 1
      lastAngle += (rand * variance) + gAngle
      points.push(new Point(Math.cos(lastAngle) * radius, Math.sin(lastAngle) * radius))
    }
    return points
  }
  setup(){
    this.positions = this.generatePoints();
    this.velocities = [new Point(0, 0), new Point(0, 0), new Point(0, 0)];
    this.colors = [0x004400, 0xFF0000, 0x0000FF]
    this.masses = [3, 4, 5]
    for(var i = 0; i<this.positions.length; i++){
      var circle = new PIXI.Graphics();
      circle.beginFill(this.colors[i]);
      circle.drawCircle(0, 0, this.masses[i]*2)
      circle.endFill()
      this.planets[i] = circle
      this.app.stage.addChild(circle)
    }
    this.app.renderer.autoResize = true;
  }
  
  load(element){
    this.element = element;
    this.app = new PIXI.Application({width: element.clientWidth, height: element.clientHeight, antialias: true, transparent: true});
    this.app.renderer.plugins.interaction.autoPreventDefault = false;
    this.app.renderer.view.style.touchAction = 'auto';
    element.appendChild(this.app.view)
  }
  onresize(width, height){
    for(var i = 0; i<this.trails.length; i++){ //Clear trails or else they'll look broken and weird.
      app.stage.removeChild(this.trails[i])
    }
    app.renderer.resize(width, height)
  }  
  mobileReset(){
    setup();
  }
  reset(){
    app.stage.removeChildren();
    setup();
  }
  start(){
    this.app.ticker.add(delta => this.update(delta));
  }
};
