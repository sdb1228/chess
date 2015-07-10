class Game < ActiveRecord::Base
	def append_move(move)
		player_move = move + " "
		self.move_list == nil ? self.move_list = player_move : self.move_list << player_move
		self.save!	
	end
	def generate_link(host) 
		"http://#{host}/replay/#{self.id}"
	end
end
