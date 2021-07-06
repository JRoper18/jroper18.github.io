import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.130.1-bsY6rEPcA1ZYyZeKdbHd/mode=imports,min/optimized/three.js';
class SquareMarkov extends Animation {
   constructor(){
        super();

        this.TICK_RATE = 20; 
        this.NUM_LEADS = 10;
        this.GRID_SIZE = 1.2;
        this.totalDelta = 0;
        this.leads = []
        this.lead_dirs = []
    }
    load(element){
      this.element = element;
      this.app = new PIXI.Application({width: element.clientWidth, height: element.clientHeight, antialias: true, transparent: true});
      this.app.renderer.plugins.interaction.autoPreventDefault = false;
      this.app.renderer.view.style.touchAction = 'auto';
      this.app.renderer.autoResize = true;
      element.appendChild(this.app.view)
    }  
    update(delta){
      this.totalDelta += delta;
      if(this.totalDelta > this.TICK_RATE){
        this.totalDelta = 0;
        for(let i = 0; i<this.leads.length; i++) {
            const dir = Math.floor(Math.random() * 4);
            const dy = (dir % 2 == 0) ? 1 : -1;
            const dx = (dir >= 2) ? 1 : -1;
            this.lead_dirs[i].x = dx;
            this.lead_dirs[i].y = dy;
        }
      }
      else {
        for(let i = 0; i<this.leads.length; i++) {
          const dir = this.lead_dirs[i];
          this.leads[i].x += (dir.x * this.GRID_SIZE * delta);
          this.leads[i].y += (dir.y * this.GRID_SIZE * delta);
        }
      }
    }
    setup(){
      for(let i = 0; i<this.NUM_LEADS; i++ ){
        var circle = new PIXI.Graphics();
        circle.beginFill(0xFF1100);
        circle.drawCircle(0, 0, 10)
        circle.endFill()  
        circle.x += (this.element.clientWidth / 2);
        circle.y += (this.element.clientHeight / 2);
        this.leads.push(circle)
        this.lead_dirs.push(new THREE.Vector2())
        this.app.stage.addChild(circle)

      }
    }
    onresize(width, height){
      // for(var i = 0; i<this.trails.length; i++){ //Clear trails or else they'll look broken and weird.
      //   this.app.stage.removeChild(this.trails[i])
      // }
      this.app.renderer.resize(width, height)
    }  
    mobileReset(){
      this.reset();
    }
    reset(){
      this.app.stage.removeChildren();
      this.setup();
    }
    start(){
      this.app.ticker.add(delta => this.update(delta));
    }
    destroy(){
      this.app.stage.destroy(true);
      this.element.removeChild(this.app.renderer.view);
      this.app.renderer.destroy(true);
    }
    start(){
      this.app.ticker.add(delta => this.update(delta));
    }
    destroy(){
      
    }
    text() {
      return "<em>What's with the animation? </em> 2D Random walks. It's just neat-looking. "
    }
};

export default SquareMarkov;