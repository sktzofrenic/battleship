from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required
from battleship.user.models import User
from battleship.game.models import GameCodeSet, Game, QuickChatCode

blueprint = Blueprint('dashboard', __name__, url_prefix='/dashboard', static_folder='../static')


@blueprint.route('/')
@login_required
def home():
    games = Game.query.all()
    games = [x.serialize for x in games if not x.ended_on]
    return render_template('admin/base.html', games=games)


@blueprint.route('/users')
@login_required
def users():
    users = User.query.all()
    return render_template('admin/users.html', users=users)


@blueprint.route('/gamecodes')
@login_required
def game_codes():
    game_code_sets = GameCodeSet.query.all()
    return render_template('admin/game_code_sets.html', game_code_sets=game_code_sets)


@blueprint.route('/chat-codes')
@login_required
def chat_codes():
    chat_codes = QuickChatCode.query.all()
    return render_template('admin/chat_codes.html', chat_codes=chat_codes)


@blueprint.route('/battleship')
@login_required
def battleship_game():
    return render_template('app.html')


@blueprint.route('/analytics')
@login_required
def analytics():
    return render_template('admin/analytics.html')
