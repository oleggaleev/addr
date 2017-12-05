class CallbacksController < ApplicationController
  def index
    omniauth_data = request.env['omniauth.auth']

    user = User.find_by_omniauth(omniauth_data)
    user ||= User.create_from_omniauth(omniauth_data)

    if user.valid?
      session[:user_id] = user.id
      redirect_to root_path, notice: "Thanks for signing in with #{params[:provider].capitalize}!"
    else
      redirect_to root_path, alert: user.errors.full_messages.join(", ")
    end
  end
end
