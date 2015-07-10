WebsocketRails::EventMap.describe do
  subscribe :send_move, 'chat#send_move'
  subscribe :game_request, 'chat#game_request'
  subscribe :connected, 'chat#client_connected'
  subscribe :game, 'chat#game'
  subscribe :client_disconnected, 'chat#closed'
  subscribe :connection_closed, 'chat#closed'
end
