class Conway extends Animation{
  generateColor(colorStart,colorEnd,colorCount){
  
    // The beginning of your gradient
    var start = this.convertToRGB (colorStart);
  
    // The end of your gradient
    var end   = this.convertToRGB (colorEnd);
  
    // The number of colors to compute
    var len = colorCount;
  
    //Alpha blending amount
    var alpha = 0.0;
  
    var saida = [];
  
    for (var i = 0; i < len; i++) {
      var c = [];
      alpha += (1.0/len);
  
      c[0] = start[0] * alpha + (1 - alpha) * end[0];
      c[1] = start[1] * alpha + (1 - alpha) * end[1];
      c[2] = start[2] * alpha + (1 - alpha) * end[2];
  
      saida.push(this.convertToHex (c));
  
    }
  
    return saida;
  
  }
 constructor(){
    super();

    this.SQUARE_SIZE = 10;
    this.NUM_COLORS = 50;

    this.colorArray = this.generateColor("#000000", "#00ffCC", this.NUM_COLORS);

    this.totalDelta = 0;
    this.TICK_RATE = 5;

  }
  makeEmptyBoard(){
    var newBoard = new Array(this.BOARD_WIDTH);
    for(var i = 0; i<=this.BOARD_WIDTH; i++){
      newBoard[i] = new Array(this.BOARD_HEIGHT);
      for(var j = 0; j<this.BOARD_HEIGHT; j++){
        newBoard[i][j] = 0;
      }
    }
    return newBoard;
  }
  load(element){
    var app = new PIXI.Application({width: element.clientWidth, height: element.clientHeight, antialias: true, transparent: true});
    this.app = app;
    app.renderer.plugins.interaction.autoPreventDefault = false;
    app.renderer.view.style.touchAction = 'auto';    
    this.element = element;
    this.BOARD_WIDTH = Math.floor(element.clientWidth / this.SQUARE_SIZE);
    this.BOARD_HEIGHT = Math.floor(element.clientHeight / this.SQUARE_SIZE);
    app.renderer.autoResize = true;
    element.appendChild(this.app.view)
  }  
  update(delta){
    this.totalDelta += delta;
    if(this.totalDelta >= this.TICK_RATE){
      this.totalDelta = 0;
      //Assemble a new board.
      var newBoard = this.makeEmptyBoard();
      for(var i = 0; i<this.BOARD_WIDTH; i++){
        for(var j = 0; j<this.BOARD_HEIGHT; j++){
          var sCount = 0;
          if(i > 0 && j > 0 && this.board[i-1][j-1]){
            sCount++;
          }
          if(i > 0 && j < this.BOARD_HEIGHT && this.board[i-1][j+1]){
            sCount++;
          }
          if(i > 0 && this.board[i-1][j]){
            sCount++;
          }
          if(i < this.BOARD_WIDTH && j < this.BOARD_HEIGHT && this.board[i+1][j+1]){
            sCount++;
          }
          if(i < this.BOARD_WIDTH && j > 0 && this.board[i+1][j-1]){
            sCount++;
          }
          if(i < this.BOARD_WIDTH && this.board[i+1][j]){
            sCount++;
          }
          if(j < this.BOARD_HEIGHT && this.board[i][j+1]){
            sCount++;
          }
          if(j > 0 && this.board[i][j-1]){
            sCount++;
          }
          if(sCount < 2 || sCount > 3){
            //Dies.
            newBoard[i][j] = 0;
          }
          else if(this.board[i][j] > 0) {
            //Lives on.
            newBoard[i][j] = this.board[i][j] + 1;
          }
          else if(sCount == 3){
            //Repopulation!
            newBoard[i][j] = 1;
          }
  
        }
      }
      this.board = newBoard;
      //Now render the space.
      this.renderBoard()
    }
  }
  ageToColor(age){
    var boundedAge = Math.min(age, this.NUM_COLORS-1);
    return parseInt(this.colorArray[boundedAge], 16);
  }
  renderBoard() {
    this.app.stage.removeChildren()
    for(var i = 0; i<this.BOARD_WIDTH; i++){
      for(var j = 0; j<this.BOARD_HEIGHT; j++){
        var liveTime = this.board[i][j];
        if(liveTime > 0){
          var newTile = new PIXI.Graphics();
          var color = this.ageToColor(liveTime)
          newTile.beginFill(color);
          newTile.drawRect(i * this.SQUARE_SIZE, j*this.SQUARE_SIZE, this.SQUARE_SIZE, this.SQUARE_SIZE);
          newTile.endFill();
          this.app.stage.addChild(newTile);
        }
      }
    }
  }
  setup(){

    this.board = this.makeEmptyBoard();
    //Make something random.
    for(var i = 0; i<this.BOARD_WIDTH; i++){
      for(var j = 0; j<this.BOARD_HEIGHT; j++){
        var rand = Math.random();
        if(rand > 0.5){
          this.board[i][j] = 1;
        }
      }
    }
    this.renderBoard();
  }
  reset(){
    this.app.stage.removeChildren();
    this.setup();
  }
  onresize(width, height){
    this.app.renderer.resize(width, height);
    this.BOARD_WIDTH = Math.floor(width / this.SQUARE_SIZE);
    this.BOARD_HEIGHT = Math.floor(height / this.SQUARE_SIZE);
    this.reset();
  }
  mobileReset(){
    this.reset();
  }
  hex (c) {
    var s = "0123456789abcdef";
    var i = parseInt (c);
    if (i == 0 || isNaN (c))
      return "00";
    i = Math.round (Math.min (Math.max (0, i), 255));
    return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
  }
  
  /* Convert an RGB triplet to a hex string */
  convertToHex (rgb) {
    return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
  }
  
  /* Remove '#' in color hex string */
  trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }
  
  /* Convert a hex string to an RGB triplet */
  convertToRGB (hex) {
    var color = [];
    color[0] = parseInt ((this.trim(hex)).substring (0, 2), 16);
    color[1] = parseInt ((this.trim(hex)).substring (2, 4), 16);
    color[2] = parseInt ((this.trim(hex)).substring (4, 6), 16);
    return color;
  }
  start(){
    this.app.ticker.add(delta => this.update(delta));
  }
  destroy(){
    this.app.stage.destroy(true);
    this.element.removeChild(this.app.view);
    this.app.renderer.destroy(true);
  }
  text() {
    return "<em>What's with the animation? </em> It's a simulation of Conway's Game of Life. It's just neat-looking. "
  }
  

  
};

export default Conway;