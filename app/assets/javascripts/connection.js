function Connection(nickName, onReceiveMove, onReceiveGameRequest){
  this.dispatcher = new WebSocketRails(location.host + '/websocket');
  this.channel = null;
  this.connection_id = null;

  thisCon = this;

  this.onMessage = function(data) {
    onReceiveMove(data);
    console.log('channel event received: ' + data);
  };

  this.onGameRequest = function(data) {
    onReceiveGameRequest(data);
  };

  this.sendMove = function(move_string){
    data = {
      connection_id: thisCon.connection_id,
      move_string: move_string
    };
    thisCon.dispatcher.trigger('send_move', data);
    console.log(move_string);
  }

  this.sendGameRequest = function(myId, theirId) {
    thisCon.dispatcher.trigger('game_request', {my_id: myId, their_id: theirId});
  }

  this.dispatcher.on_open = function(data) {
    var connectionObj = { connection_id: data.connection_id, nick_name: nickName };
    thisCon.connection_id = data.connection_id;
    thisCon.dispatcher.trigger('connected',  connectionObj);
    thisCon.channel = thisCon.dispatcher.subscribe(data.connection_id);

    thisCon.channel.bind('send_move', function(data) {
      thisCon.onMessage(data);
    });

    thisCon.channel.bind('game_request', function(data) {
      thisCon.onGameRequest(data);
    });
  };

}
