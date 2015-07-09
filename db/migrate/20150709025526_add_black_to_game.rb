class AddBlackToGame < ActiveRecord::Migration
  def change
    add_column :games, :black, :integer
    add_column :games, :white, :integer
    add_column :games, :move_list, :string
  end
end
