class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :white
      t.string :black
      t.string :move_list

      t.timestamps null: false
    end
  end
end
