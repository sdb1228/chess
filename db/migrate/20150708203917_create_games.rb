class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :white
      t.string :integer
      t.string :blah
      t.string :integer

      t.timestamps null: false
    end
  end
end
