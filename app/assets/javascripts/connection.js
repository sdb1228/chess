function Connection(nickName, onReceiveMove, onSuccess, onFailure){
  this.dispatcher = new WebSocketRails(location.host + '/websocket');
  this.channel = null;
  this.connection_id = null;

  thisCon = this;

  this.onMessage = function(data) {
    onReceiveMove(data);
    console.log('channel event received: ' + data);
  };

  this.sendMove = function(move_string){
    data = {
      connection_id: thisCon.connection_id,
      move_string: move_string
    };
    thisCon.dispatcher.trigger('message', data, onSuccess, onFailure);
    console.log(move_string);
  }

  this.dispatcher.on_open = function(data) {
    var connectionObj = { connection_id: data.connection_id, nick_name: nickName };
    thisCon.connection_id = data.connection_id;
    thisCon.dispatcher.trigger('message', data.connection_id);
    thisCon.dispatcher.trigger('connected',  connectionObj);
    thisCon.channel = thisCon.dispatcher.subscribe(data.connection_id);

    thisCon.channel.bind('message', function(data) {
      onMessage(data);
    });
  };

}
