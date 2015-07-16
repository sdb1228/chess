class Game < ActiveRecord::Base
  has_many :moves

	def append_move(move, fen, side)
		player_move = move + " "
		self.move_list == nil ? self.move_list = player_move : self.move_list << player_move
		self.save!
    save_move(move, fen, side)
	end

  def save_move(move, fen, side)
    moves.create({
      move_string: move,
      fen: fen,
      side: side
    })
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
