class ChatController < WebsocketRails::BaseController
  def client_connected
    puts "here"
  end
end
