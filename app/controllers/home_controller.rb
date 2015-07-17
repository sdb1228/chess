class HomeController < ApplicationController
  def index
  end

  def playgame
    @orientation = ""
    @waiting_players = []
    if params[:nick_name]
      # This user gave us a nickname and is looking for other players
      @looking = true

      #register user
      nick_name = params[:nick_name]
      @u = User.find_or_initialize_by(nick_name: nick_name)
      @u.save!
      # get list of available players
      players = User.where('connection_id is not null')

      @waiting_players = players - [@u]
    elsif params[:game_id]
      # This user came from a link and doesn't have a nickname
      @looking = false

      @game = Game.find(params[:game_id])
      @u = User.find_or_initialize_by(nick_name: User.make_random_name)
      @u.save!

      if !@game.white
        #first player gets white
        @game.white = @u.id
        @orientation = "white"

      elsif !@game.black
        #second player gets black
        @game.black = @u.id
        @orientation = "black"

      else
        #already 2 players?
        render "gamefull"
        return
      end

      @game.save!
    end
  end

  def replay
    @game = Game.find(params[:game_id])
    moves = Move.where("game_id = ?", @game.id)
    @fens = moves.map{ |move| move.fen} 
  end

  def creategame
    @game = Game.create
    @link = @game.generate_play_link request.host_with_port
  end

end
