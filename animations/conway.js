var element = document.getElementById("launch-background")
var app = new PIXI.Application({width: element.clientWidth, height: element.clientHeight, antialias: true, transparent: true});
app.ticker.add(delta => update(delta));
app.renderer.plugins.interaction.autoPreventDefault = false;
app.renderer.view.style.touchAction = 'auto';

var SQUARE_SIZE = 10;
var BOARD_WIDTH = Math.floor(element.clientWidth / SQUARE_SIZE);
var BOARD_HEIGHT = Math.floor(element.clientHeight / SQUARE_SIZE);
var NUM_COLORS = 50;

var colorArray = generateColor("#000000", "#00ffCC", NUM_COLORS);

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
        else if(board[i][j] > 0) {
          //Lives on.
          newBoard[i][j] = board[i][j] + 1;
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
function ageToColor(age){
  var boundedAge = Math.min(age, NUM_COLORS-1);
  return parseInt(colorArray[boundedAge], 16);
}
function renderBoard() {
  app.stage.removeChildren()
  for(var i = 0; i<BOARD_WIDTH; i++){
    for(var j = 0; j<BOARD_HEIGHT; j++){
      var liveTime = board[i][j];
      if(liveTime > 0){
        var newTile = new PIXI.Graphics();
        var color = ageToColor(liveTime)
        newTile.beginFill(color);
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

function hex (c) {
  var s = "0123456789abcdef";
  var i = parseInt (c);
  if (i == 0 || isNaN (c))
    return "00";
  i = Math.round (Math.min (Math.max (0, i), 255));
  return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex (rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }

/* Convert a hex string to an RGB triplet */
function convertToRGB (hex) {
  var color = [];
  color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
  color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
  color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
  return color;
}

function generateColor(colorStart,colorEnd,colorCount){

	// The beginning of your gradient
	var start = convertToRGB (colorStart);

	// The end of your gradient
	var end   = convertToRGB (colorEnd);

	// The number of colors to compute
	var len = colorCount;

	//Alpha blending amount
	var alpha = 0.0;

	var saida = [];

	for (i = 0; i < len; i++) {
		var c = [];
		alpha += (1.0/len);

		c[0] = start[0] * alpha + (1 - alpha) * end[0];
		c[1] = start[1] * alpha + (1 - alpha) * end[1];
		c[2] = start[2] * alpha + (1 - alpha) * end[2];

		saida.push(convertToHex (c));

	}

	return saida;

}

setup()
