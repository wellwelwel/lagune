require "base64"

class PreferencesController < ApplicationController
  def show
    raw = cookies[:preferences]
    preferences = raw ? Marshal.load(Base64.decode64(raw)) : { "frequency" => "weekly" }

    render json: preferences
  end
end
