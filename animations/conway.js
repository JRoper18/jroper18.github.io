var element = document.getElementById("launch-background")
var app = new PIXI.Application({width: element.clientWidth, height: element.clientHeight, antialias: true, transparent: true});
app.ticker.add(delta => update(delta));
app.renderer.plugins.interaction.autoPreventDefault = false;
app.renderer.view.style.touchAction = 'auto';

var SQUARE_SIZE = 10;
var BOARD_WIDTH = Math.floor(element.clientWidth / SQUARE_SIZE);
var BOARD_HEIGHT = Math.floor(element.clientHeight / SQUARE_SIZE);

var totalDelta = 0;
var TICK_RATE = 5;
function makeEmptyBoard(){
  var newBoard = new Array(BOARD_WIDTH);
  for(var i = 0; i<=BOARD_WIDTH; i++){
    newBoard[i] = new Array(BOARD_HEIGHT);
    for(var j = 0; j<BOARD_HEIGHT; j++){
      newBoard[i][j] = 0;
    }
  }
  return newBoard;
}
function update(delta){
  totalDelta += delta;
  if(totalDelta >= TICK_RATE){
    totalDelta = 0;
    //Assemble a new board.
    var newBoard = makeEmptyBoard();
    for(var i = 0; i<BOARD_WIDTH; i++){
      for(var j = 0; j<BOARD_HEIGHT; j++){
        var sCount = 0;
        if(i > 0 && j > 0 && board[i-1][j-1]){
          sCount++;
        }
        if(i > 0 && j < BOARD_HEIGHT && board[i-1][j+1]){
          sCount++;
        }
        if(i > 0 && board[i-1][j]){
          sCount++;
        }
        if(i < BOARD_WIDTH && j < BOARD_HEIGHT && board[i+1][j+1]){
          sCount++;
        }
        if(i < BOARD_WIDTH && j > 0 && board[i+1][j-1]){
          sCount++;
        }
        if(i < BOARD_WIDTH && board[i+1][j]){
          sCount++;
        }
        if(j < BOARD_HEIGHT && board[i][j+1]){
          sCount++;
        }
        if(j > 0 && board[i][j-1]){
          sCount++;
        }
        if(sCount < 2 || sCount > 3){
          //Dies.
          newBoard[i][j] = 0;
        }
        else if(board[i][j] == 1) {
          //Lives on.
          newBoard[i][j]++;
        }
        else if(sCount == 3){
          //Repopulation!
          newBoard[i][j] = 1;
        }

      }
    }
    board = newBoard;
    //Now render the space.
    renderBoard()
  }
}
function renderBoard() {
  app.stage.removeChildren()
  for(var i = 0; i<BOARD_WIDTH; i++){
    for(var j = 0; j<BOARD_HEIGHT; j++){
      if(board[i][j] > 0){
        var newTile = new PIXI.Graphics();
        newTile.beginFill(0xCCCCCC);
        newTile.drawRect(i * SQUARE_SIZE, j*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        newTile.endFill();
        app.stage.addChild(newTile);
      }
    }
  }
}
function setup(){
  app.stage.removeChildren();
  BOARD_WIDTH = Math.floor(element.clientWidth / SQUARE_SIZE);
  BOARD_HEIGHT = Math.floor(element.clientHeight / SQUARE_SIZE);

  board = makeEmptyBoard();
  //Make something random.
  for(var i = 0; i<BOARD_WIDTH; i++){
    for(var j = 0; j<BOARD_HEIGHT; j++){
      var rand = Math.random();
      if(rand > 0.5){
        board[i][j] = 1;
      }
    }
  }
  renderBoard();
  element.appendChild(app.view)
  app.renderer.autoResize = true;
}

window.onresize = function(event){
  app.renderer.resize(element.clientWidth, element.clientHeight)
}
var tapedTwice = false;
function mobileReset(){
  if(!tapedTwice) {
      tapedTwice = true;
      setTimeout( function() { tapedTwice = false; }, 300 );
      return false;
  }
  event.preventDefault();
  setup();
}
$( document ).ready(function() {
  if(window.isMobile){
    element.addEventListener("click", function(){
      mobileReset()
    })
    element.addEventListener("touchstart", function(){
      mobileReset()
    })
    //Also, change the reset text.
    document.getElementById("resetText").innerHTML = "Double-tap to reset. "
  }
  else{
    element.addEventListener("click", function(){
      setup()
    })
  }
})



setup()
