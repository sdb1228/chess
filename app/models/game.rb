class Game < ActiveRecord::Base
	def append_move(move)
		player_move = move + " "
		self.move_list == nil ? self.move_list = player_move : self.move_list << player_move
		self.save!
	end

  def generate_replay_link(host)
    generate_link host, "replay"
  end

  def generate_play_link(host)
    generate_link host, "playgame"
  end

  def generate_link(host, action)
		"http://#{host}/#{action}/#{self.id}"
  end

end
