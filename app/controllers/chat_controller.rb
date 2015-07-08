class ChatController < WebsocketRails::BaseController
  def initialize_session
    controller_store[data[:connection_id]] = data[:nick_name]
  end
  def message
	# send_message :send, "blah", :namespace => :message
	WebsocketRails[data].trigger(:message, " YO THIS IS THE TEST")
  end
  def client_connected
  	controller_store[data[:connection_id]] = data[:nick_name]
  end
end