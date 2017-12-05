class Coupon < ApplicationRecord
  belongs_to :user, dependent: :destroy
end
