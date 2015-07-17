var game = null;
var index = 0;
var moveList = null;
var moveAnimator = null;

$(document).ready(function(){

  //display the move list

  //make an array of the move list
  moveList = convertMoveList();

  var cfg = {
    draggable: false,
    statusElId: '#status',
    pgnElId: '#pgn',
    moveList: moveList
  };
  game = new window.Game('board', cfg, null, 0);

});

function convertMoveList(){
  returnList = moveListString.split(" ");
  returnList.pop();
  return returnList;
}

function startMoves() {
    moveAnimator = setInterval(makeMove, 500);
    $('.start').prop('disabled', true);
    $('#stop').prop('disabled', false);
}

function stopMoves() {
  $('.start').prop('disabled', false);
    $('#stop').prop('disabled', true);
    clearInterval(moveAnimator);
}

function makeMove() {
  if (index > fens.length -1) {
    clearInterval(moveAnimator);
    return;
  }
  index++;
  game.position(fens[index]);
}

function makePreviousMove() {
  if (index < 1) {
    return;
  }
  index--;
  game.position(fens[index]);
}

function reset() {
  game.start();
  index = 0;
}


//copied from playgame.js
// don't hate the player, hate the game ... please

$(document).on('change', '#changeShowNotation', function(e){
  var show = false;
  if($(this).is(':checked'))
    show = true;

  game.changeShowNotation(show);
});

$(document).on('change', '#changeHighlightLegalMoves', function(e) {
  var highlight = false;
  if($(this).is(':checked'))
    highlight = true;

  game.changeHighlightLegalMoves(highlight);
});

$(document).on('change', '#changeHighlightPreviousMove', function(e){
  var highlight = false;
  if($(this).is(':checked'))
    highlight = true;

  game.changeHighlightPreviousMove(highlight);
});