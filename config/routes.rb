Rails.application.routes.draw do
  get "/auth/twitter", as: :sign_in_with_twitter
  get "/auth/facebook", as: :sign_in_with_facebook
  get "/auth/:provider/callback", to: "callbacks#index"
  get 'auth/failure', to: redirect('/'), via: [:get, :post]

  resources :coupons, only: [:index, :create]

  resources :users, only: [:new, :create, :show] do
    resources :coupons, only: [:create, :destroy]
  end


  resource :session, only: [:new, :create, :destroy]
  resources :welcome

  root 'welcome#index'

end
