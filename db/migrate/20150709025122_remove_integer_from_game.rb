class RemoveIntegerFromGame < ActiveRecord::Migration
  def change
    remove_column :games, :integer, :string
    remove_column :games, :blah, :string
  end
end
