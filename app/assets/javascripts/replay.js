var game = null;

$(document).ready(function(){

  //display the move list

  //make an array of the move list
  var moveList = convertMoveList();

  var cfg = {
    draggable: false,
    statusElId: '#status',
    pgnElId: '#pgn',
    moveList: moveList
  };
  game = new window.Game('board', cfg, null, 0);

});

function convertMoveList(){
  return moveListString.split(" ");
}


function myFunction() {
    canAnimate = false;
    moveAnimator = setTimeout(makeRandomMove, 500);
    $('.start').prop('disabled', true);
    $('#stop').prop('disabled', false);
}

function myStopFunction() {
  $('.start').prop('disabled', false);
    $('#stop').prop('disabled', true);
    clearTimeout(moveAnimator);
    canAnimate = true;
}