var connection = null;
var game = null;

$(document).ready(function(){
  connection = new window.Connection(me.nickName, receiveMove, receiveGameRequest, startGame);
  showListOfPlayers();
});

function showListOfPlayers() {
  players.forEach(function(player){
    var string = "<li><span>" + player.nickName + "</span><button class='playThisGuy' data-nickName='" + player.nickName + "' data-id='" + player.id + "'>Play this guy</button></li>";
    $("#playerList").append(string);
  });
}

$(document).on('click', '.playThisGuy', function(data){
  var theirId = $(this).data('id');
  connection.sendGameRequest(me.id, theirId);
});

$(document).on('click', '.playMe', function(data){
	var theirId = $(this).data('id');
	var theirname = $(this).data('nickname');
	var body = "<p>" + theirname + " has invited you to play a game! Accept below </p>"
	$('.modal-title').text(theirname + " wants to play!");
	$('.modal-body').append(body);
	$('#accept').data('id', theirId);
	$("#myModal").modal(); 
});
$(document).on('click', '#accept', function(data){
	var theirId = $(this).data('id')
	$('#myModal').modal('hide');
	$("ul").find("[data-id='" + theirId + "']").text("Play this guy");
	$("ul").find("[data-id='" + theirId + "']").removeClass("playMe")
  	connection.confirmRequest(me.id, theirId);
});


function receiveMove(data){
	game.move(data);
}

function receiveGameRequest(data) {
	$("ul").find("[data-id='" + data.id + "']").text("Wants to Play");
	$("ul").find("[data-id='" + data.id + "']").addClass("playMe");
}

function startGame(orientation, gameID) {
  var cfg = {
    orientation: orientation,
    statusElId: '#status',
    pgnElId: '#pgn'
  };
  $("#gameDiv").show();
  game = new window.Game('board', cfg, connection.sendMove, gameID);
}