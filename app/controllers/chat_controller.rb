class ChatController < WebsocketRails::BaseController
  def initialize_session
    controller_store[data[:connection_id]] = data[:nick_name]
  end
  def send_move
	# send_message :send, "blah", :namespace => :message
	WebsocketRails[data[:connection_id]].trigger(:send_move, " YO THIS IS THE TEST")
  end
  def client_connected
  	controller_store[data[:connection_id]] = data[:nick_name]
  	user = User.find_or_initialize_by(nick_name: data[:nick_name])
  	user.update(connection_id: data[:connection_id])
  	user.save!
  end
end