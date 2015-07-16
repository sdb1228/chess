class CreateMoves < ActiveRecord::Migration
  def change
    create_table :moves do |t|
      t.integer :game_id
      t.string :side
      t.string :move_string
      t.string :fen

      t.timestamps null: false
    end
  end
end
