class HomeController < ApplicationController
  def index
  end

  def playgame
    #register user
    nick_name = params[:nick_name]
    @u = User.find_or_initialize_by(nick_name: nick_name)
    @u.save!
    # get list of available players
    players = User.where('connection_id is not null')

    @waiting_players = players - [@u]
  end

  def replay
    @game = Game.find(params[:id])
  end

end
