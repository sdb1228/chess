class ChatController < WebsocketRails::BaseController
  def initialize_session
    controller_store[data[:connection_id]] = data[:nick_name]
  end
  def send_move
	g = Game.find(data[:game_id])
	white = User.find(g.white)
	black = User.find(g.black)
	if white.connection_id != data[:connection_id]
		connection_id = white.connection_id
		WebsocketRails[connection_id].trigger(:send_move, data[:move_string])
	else
		connection_id = black.connection_id
		WebsocketRails[connection_id].trigger(:send_move, data[:move_string])
	end
  end
  def client_connected
  	controller_store[data[:connection_id]] = data[:nick_name]
  	user = User.find_or_initialize_by(nick_name: data[:nick_name])
  	user.update(connection_id: data[:connection_id])
  	user.save!
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
end