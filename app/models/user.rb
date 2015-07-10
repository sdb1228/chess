class User < ActiveRecord::Base

  def self.make_random_name
    "ChessMaster#{rand(1..1000000000000)}"
  end

end
