class ChatController < WebsocketRails::BaseController

  def send_move
    g = Game.find(data[:game_id])
    g.append_move(data[:move_string], data[:fen], data[:side])

    if data[:side] == 'white'
      opponent = User.find(g.black)
    else
      opponent = User.find(g.white)
    end

    connection_id = opponent.connection_id
    WebsocketRails[connection_id].trigger(:send_move, data[:move_string])

    if data[:move_string].include?("#") or data[:move_string].include?("$")
      link = g.generate_replay_link(request.host_with_port)
      WebsocketRails[connection_id].trigger(:send_move, {endOfGame: link})
      WebsocketRails[data[:connection_id]].trigger(:send_move, {endOfGame: link})
    end
  end

  def client_connected
    controller_store[data[:connection_id]] = data[:nick_name]
    WebsocketRails.users[data[:connection_id]] = data[:nick_name]
  	user = User.find_or_initialize_by(nick_name: data[:nick_name])
  	user.update(connection_id: data[:connection_id])
  	user.save!
    players_list = User.where('connection_id is not null')
    players = []
    players_list.map{|u|
      temp = {id: u.id, nickName: u.nick_name}
      players << temp
    }
    broadcast_message :update_player_list, {players: players}
  end

  def game_request
    requester = User.find(data[:my_id])
    requestee = User.find(data[:their_id])
    connection_id = requestee.connection_id
    WebsocketRails[connection_id].trigger(:game_request, requester)
  end

  def game
    users = data.values.shuffle
    game = Game.create(white: users.first, black: users.last)
    white = User.find(users.first)
    black = User.find(users.last)
    white_connection = white.connection_id
    black_connection = black.connection_id

    WebsocketRails[white_connection].trigger(:game, {color: "white", opponent: black, game_id: game.id})
    WebsocketRails[black_connection].trigger(:game, {color: "black", opponent: white, game_id: game.id})
  end

  def closed
    controller_store.delete(client_id)
    user = User.where(connection_id: client_id).first
    user.connection_id = nil
    user.save!
    players_list = User.where('connection_id is not null')
    players = []
    players_list.map{|u| temp ={id: u.id, nickName: u.nick_name}; players << temp}
    broadcast_message :update_player_list, {players: players}
  end

  def ready_ping
    requester = User.find(data[:my_id])
    game = Game.find(data[:game_id])
    if game.white && game.black
      waiting_player_id = nil
      waiting_player_color = "white"
      my_color = "black"
      if game.white == requester
        waiting_player_id = game.black
        waiting_player_color = "black"
        my_color = "white"
      else
        waiting_player_id = game.white
      end
      waiting_player = User.find(waiting_player_id)
      WebsocketRails[waiting_player.connection_id].trigger(:ready_ping, {color: waiting_player_color, game_id: game.id})
      WebsocketRails[requester.connection_id].trigger(:ready_ping, {color: my_color, game_id: game.id})
    end
  end
end