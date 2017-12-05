class Ability
  include CanCan::Ability

  def initialize(user)

    user ||= User.new # guest user (not logged in)

    alias_action :create, :read, :update, :destroy, :to => :crud

    # can :crud, Question do |question|
    #   question.user == user
    # end
    #
    # can :manage, Answer do |answer|
    #   answer.user == user
    # end
    #
    # can :like, Question do |question|
    #   question.user != user
    # end
    #
    # can :destroy, Like do |like|
    #   like.user == user
    # end
    #
    # can :crud, Vote do |vote|
    #   vote.user == user
    # end

  end
end
