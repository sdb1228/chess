var connection = null;
var game = null;

$(document).ready(function(){
  connection = new window.Connection(me.nickName, receiveMove, receiveGameRequest, startGame);
  showListOfPlayers();
  $("#player-nickname h4").text(me.nickName);
});

function showListOfPlayers() {
  players.forEach(function(player){
    var string = "<li class='list-group-item'>" +
    "<div class='container-fluid'>" +
    "<div class='row'>" +
    "<div class='col-xs-6'>" +
    "<span>" + player.nickName + " </span>" +
    "</div>" +
    "<div class='col-xs-6'>" +
    "<button class='btn btn-primary playThisGuy' data-nickName='" + player.nickName + "' data-id='" + player.id + "'>Send request to play</button>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</li>";
    $("#playerList").append(string);
  });
}

$(document).on('click', '.playThisGuy', function(data){
  var theirId = $(this).data('id');
  $(this).text("waiting…");
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
	var button = $("#playerList").find("[data-id='" + theirId + "']");
  button.text("Send request to play");
	button.removeClass("playMe");
  button.children(".fa-certificate").remove();
  connection.confirmRequest(me.id, theirId);
});


function receiveMove(data){
	game.move(data);
}

function receiveGameRequest(data) {
	var button = $("#playerList").find("[data-id='" + data.id + "']");
  button.text(" Wants to Play. Click to accept");
  button.prepend("<i class='fa fa-certificate'></i>");
	$("#playerList").find("[data-id='" + data.id + "']").addClass("playMe");
}

function startGame(orientation, gameID) {
  var cfg = {
    orientation: orientation,
    statusElId: '#status',
    pgnElId: '#pgn'
  };
  $("#gameDiv").show();
  $("#game-list-panel").hide();
  $("#header").text("Play chess!")
  game = new window.Game('board', cfg, connection.sendMove, gameID);
}