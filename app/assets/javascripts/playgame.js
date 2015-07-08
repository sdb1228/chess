$(document).ready(function(){
  var cfg = {
    orientation: decideBlackWhite(),
    statusElId: '#status',
    pgnElId: '#pgn'
  };
  var game = new window.Game('board', cfg, sendLastMove);
  var connection = new window.Connection();
});


function decideBlackWhite(){
  return 'white'; //for now
}

function sendLastMove(move_string) {
  console.log(move_string);
}