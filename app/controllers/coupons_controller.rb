class CouponsController < ApplicationController
  before_action :find_user, only: [:show, :edit, :update, :destroy]


  def index
    @coupon = Coupon.new
  end

  def create
    @user = current_user
    @coupon = @user.coupons.find(params[:id])
    coupon_params = params.require(:coupon).permit(:title)
    @coupon = Coupon.new coupon_params
    @coupon.user = current_user
    @coupon.save
    redirect_to user_path(current_user), notice: 'Ad saved!'
  end

  private

  def find_user
    @user = User.find params[:id]
  end

end
