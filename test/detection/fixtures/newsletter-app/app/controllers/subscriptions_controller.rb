class SubscriptionsController < ApplicationController
  def create
    subscription = Subscription.create!(subscription_params)

    render json: { id: subscription.id }, status: :created
  end

  private

  def subscription_params
    params.require(:subscription).permit(:email, :frequency)
  end
end
