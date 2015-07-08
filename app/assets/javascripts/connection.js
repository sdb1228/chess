
  var dispatcher = new WebSocketRails('localhost:3000/websocket');
  dispatcher.on_open = function(data) {
    var connectionObj = { connection_id: data.connection_id, nick_name: "nick_name" }
    connection_id = data.connection_id;
    dispatcher.trigger('connected',  connectionObj);
    var channel = dispatcher.subscribe(data.connection_id);
    channel.bind('message', function(data) {

      console.log('channel event received: ' + data);
    });
  }

dispatcher.trigger('message', connection_id);