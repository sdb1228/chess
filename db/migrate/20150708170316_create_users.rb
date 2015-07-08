class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :nick_name
      t.string :connection_id

      t.timestamps null: false
    end
  end
end
