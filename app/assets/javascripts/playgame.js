$(document).ready(function(){
  var cfg = {
    orientation: decideBlackWhite(),
    statusElId: '#status',
    pgnElId: '#pgn'
  };
  var connection = new window.Connection('nick_name', receiveMove, null, null);
  var game = new window.Game('board', cfg, connection.sendMove);
});

function decideBlackWhite(){
  return 'white'; //for now
}

function receiveMove(data){
  console.log(data);
}