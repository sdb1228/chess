function Connection(nickName, onReceiveMove, onReceiveGameRequest, startGame, endGame){
  this.dispatcher = new WebSocketRails(location.host + '/websocket');
  this.channel = null;
  this.connection_id = null;
  this.game_id = null;
  this.connected = false;
  this.readyPing = {
    pending: false
  };

  thisCon = this;

  this.onMessage = function(data) {
    onReceiveMove(data);
  };

  this.onGameRequest = function(data) {
    onReceiveGameRequest(data);
  };

  this.onEndGame = function(link) {
    endGame(link);
  };

  this.confirmRequest = function(myId, theirId) {
    thisCon.dispatcher.trigger('game', {my_id: myId, their_id: theirId});
  };

  this.onGameStart = function(data) {
    startGame(data.color, data.game_id);
  };

  this.sendMove = function(move_string){
    data = {
      connection_id: thisCon.connection_id,
      move_string: move_string,
      game_id: thisCon.game_id

    };
    thisCon.dispatcher.trigger('send_move', data);
  };

  this.sendGameRequest = function(myId, theirId) {
    thisCon.dispatcher.trigger('game_request', {my_id: myId, their_id: theirId});
  };

  this.sendReadyPing = function(myId, gameId){
    if (thisCon.connected){
      thisCon.dispatcher.trigger('ready_ping', {my_id: myId, game_id: gameId});
      thisCon.readyPing.pending = false;
    }else{
      thisCon.readyPing.pending = true;
      thisCon.readyPing.myId = myId;
      thisCon.readyPing.gameId = gameId;
    }
  };

  this.dispatcher.on_open = function(data) {
    var connectionObj = { connection_id: data.connection_id, nick_name: nickName };
    thisCon.connection_id = data.connection_id;
    thisCon.dispatcher.trigger('connected',  connectionObj);
    thisCon.channel = thisCon.dispatcher.subscribe(data.connection_id);

    thisCon.connected = true;
    if(thisCon.readyPing.pending){
      thisCon.sendReadyPing(thisCon.readyPing.myId, thisCon.readyPing.gameId);
    }

    thisCon.channel.bind('send_move', function(data) {
      if (data.endOfGame) {
        thisCon.onEndGame(data.endOfGame)
      }
      else {
        thisCon.onMessage(data);
      }
    });

    thisCon.channel.bind('game_request', function(data) {
      thisCon.onGameRequest(data);
    });
    thisCon.channel.bind('game', function(data) {
      thisCon.game_id = data.game_id;
      thisCon.onGameStart(data);
    });
    thisCon.channel.bind('ready_ping', function(data){
      thisCon.game_id = data.game_id;
      thisCon.onGameStart(data);
    });
    thisCon.dispatcher.bind('update_player_list', function(data){
        players = data.players;
        var index = players.map(function(p) { return p.id; }).indexOf(me.id);
        if (index > -1) {
          players.splice(index, 1);
        }
        showListOfPlayers();
    });
  };

}
