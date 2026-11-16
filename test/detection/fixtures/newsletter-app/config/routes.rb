Rails.application.routes.draw do
  resource :preferences, only: [:show]
  resources :subscriptions, only: [:create]
end
