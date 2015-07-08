class HomeController < ApplicationController
  def index
  end

  def playgame
    #register user
    nick_name = params[:nick_name]
    @u = User.find_or_initialize_by(nick_name: nick_name)

    # get list of available players
    players = User.all

    @waiting_players = players - [@u]

  end

end
