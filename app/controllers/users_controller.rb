class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new user_params

    if @user.save
      session[:user_id] = @user.id

      flash[:notice] = 'Thank you for signing up!'
      redirect_to root_path #, notice: 'Thank you for signing up!'
    else
      render :new
    end
  end

  def show
    @user = current_user
    @coupon = Coupon.new
  end

  private
  def user_params
    params.require(:user).permit(
      :first_name, :last_name, :email, :password, :password_confirmation
    )
  end
end
