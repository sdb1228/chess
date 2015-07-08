var connection = null;
var game = null;

$(document).ready(function(){
  connection = new window.Connection(me.nickName, receiveMove, receiveGameRequest);

  showListOfPlayers();

});

function showListOfPlayers() {
  players.forEach(function(player){
    var string = "<li><span>" + player.nickName + "</span><button class='playThisGuy' data-id='" + player.id + "'>Play this guy</button></li>";
    $("#playerList").append(string);
  });
}

$(document).on('click', '.playThisGuy', function(data){
  var theirId = $(this).data('id');
  connection.sendGameRequest(me.id, theirId);
});


function receiveMove(data){
  console.log(data);
}

function receiveGameRequest(data) {

}

function startGame(orientation) {
  var cfg = {
    orientation: orientation,
    statusElId: '#status',
    pgnElId: '#pgn'
  };
  game = new window.Game('board', cfg, connection.sendMove);
}