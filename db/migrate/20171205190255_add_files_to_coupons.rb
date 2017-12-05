class AddFilesToCoupons < ActiveRecord::Migration[5.1]
  def change
    add_column :coupons, :file_url, :string
  end
end
