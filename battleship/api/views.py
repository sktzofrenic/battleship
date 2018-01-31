from flask import Blueprint, flash, redirect, render_template, request, url_for, jsonify, send_file
from flask_login import login_required, current_user
from battleship.user.models import User
from battleship.game.models import GameCode, GameCodeSet, Action, Game
from battleship.utils import try_parsing_date
import csv
import io

blueprint = Blueprint('api', __name__, url_prefix='/api/v1', static_folder='../static')


@blueprint.route('/chatstats', methods=['GET', 'POST'])
@blueprint.route('/chatstats/<int:game_id>', methods=['GET', 'DELETE', 'PUT'])
@login_required
def chat_stats(game_id=None):
    if request.method == 'GET':
        game = Game.query.filter_by(id=game_id).first()
        writer_file = io.StringIO()
        writer = csv.writer(writer_file, dialect='excel', delimiter=',')
        writer.writerow([u'Game ID', u'Event ID', u'Sender', u'Message', u'Channel', u'1=player One, 2=player two, 3=GM, 4=Obs'])
        for event in game.chat_events:
            writer.writerow([game.id, event.id, event.sender, event.message, event.channel])

        # Creating the byteIO object from the StringIO Object
        mem = io.BytesIO()
        mem.write(writer_file.getvalue().encode('utf-8'))
        # seeking was necessary. Python 3.5.2, Flask 0.12.2
        mem.seek(0)
        return send_file(mem,
                         attachment_filename="game_chat_{}.csv".format(game.id),
                         as_attachment=True)


@blueprint.route('/eventstats', methods=['GET', 'POST'])
@blueprint.route('/eventstats/<int:game_id>', methods=['GET', 'DELETE', 'PUT'])
@login_required
def event_stats(game_id=None):
    if request.method == 'GET':
        game = Game.query.filter_by(id=game_id).first()
        writer_file = io.StringIO()
        writer = csv.writer(writer_file, dialect='excel', delimiter=',')
        writer.writerow([u'Game ID', u'Event ID', u'Name', u'Type', u'Data'])
        for event in game.game_events:
            writer.writerow([game.id, event.id, event.action.name, event.action.type_, event.action.data])

        # Creating the byteIO object from the StringIO Object
        mem = io.BytesIO()
        mem.write(writer_file.getvalue().encode('utf-8'))
        # seeking was necessary. Python 3.5.2, Flask 0.12.2
        mem.seek(0)
        return send_file(mem,
                         attachment_filename="game_events_{}.csv".format(game.id),
                         as_attachment=True)


@blueprint.route('/games', methods=['GET', 'POST'])
@blueprint.route('/game/<int:game_id>', methods=['DELETE', 'PUT', 'GET'])
@login_required
def games(game_id=None):
    request_data = request.get_json()
    if request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        if game_id:
            game = Game.query.filter_by(id=game_id).first()
            game_codes = [x.serialize for x in game.game_code_set.game_codes]
            return jsonify({
                'game': game.serialize,
                'game_codes': game_codes,
                'participants': [x.serialize for x in game.game_participants],
                'actions': [x.serialize for x in game.game_events]
            })
        games = Game.query.order_by(Game.ended_on.desc()).paginate(page, 14, False)
        return jsonify({
            'active_games': [x.serialize for x in games.items if not x.ended_on],
            'all_games': [x.serialize for x in games.items]
        })
    if request.method == 'POST':
        game = Game.create(name=request_data.get('name', None),
                           created_on=try_parsing_date(request_data.get('createdOn', None)),
                           is_offsite=request_data.get('isOffsite', None),
                           arsenal_timeout=request_data.get('arsenalTimeout', None),
                           game_code_set_id=request_data.get('gameCodeSetID', None))
        return jsonify({
            'game': game.serialize
        })
    if request.method == 'DELETE':
        Game.query.filter_by(id=game_id).first().delete()
        return jsonify({
            'result': 'ok'
        })


@blueprint.route('/actions', methods=['GET', 'POST'])
@blueprint.route('/action/<int:action_id>', methods=['DELETE', 'PUT'])
@login_required
def actions(action_id=None):
    if request.method == 'GET':
        actions = Action.query.all()
        return jsonify({
            'actions': [x.serialize for x in actions]
        })


@blueprint.route('/game_code_sets', methods=['GET', 'POST'])
@blueprint.route('/game_code_sets/<int:game_code_set_id>', methods=['DELETE', 'PUT'])
@login_required
def game_code_sets(game_code_set_id=None):
    request_data = request.get_json()
    if game_code_set_id:
        game_code_set = GameCodeSet.query.filter_by(id=game_code_set_id).first()
    if request.method == 'GET':
        game_code_sets = GameCodeSet.query.all()
        return jsonify({
            'game_code_sets': [x.serialize for x in game_code_sets]
        })
    if request.method == 'POST':
        GameCodeSet.create(name=request_data.get('name', None))
        return jsonify({
            'result': 'ok'
        })
    if request.method == 'PUT':
        game_code_set = GameCodeSet.query.filter_by(id=game_code_set_id).first()
        game_code_set.name = request_data.get('name', None)
        game_code_set.save()
        return jsonify({
            'result': 'ok'
        })
    if request.method == 'DELETE':
        GameCodeSet.query.filter_by(id=game_code_set_id).first().delete()
        return jsonify({
            'result': 'ok'
        })


@blueprint.route('/game_code_set/<int:game_code_set_id>/game_codes', methods=['GET', 'POST'])
@blueprint.route('/game_code_set/<int:game_code_set_id>/game_codes/<int:game_code_id>', methods=['DELETE', 'PUT'])
@login_required
def game_codes(game_code_set_id=None, game_code_id=None):
    request_data = request.get_json()
    if request.method == 'GET':
        game_codes = GameCode.query.filter_by(game_code_set_id=game_code_set_id).all()
        return jsonify({
            'game_codes': [x.serialize for x in game_codes]
        })
    if request.method == 'POST':
        GameCode.create(name=request_data.get('code', None),
                        action_id=request_data.get('actionId', None),
                        game_code_set_id=game_code_set_id)
        return jsonify({
            'result': 'ok'
        })
    if request.method == 'DELETE':
        GameCode.query.filter_by(id=game_code_id).first().delete()
        return jsonify({
            'result': 'ok'
        })


@blueprint.route('/users/current_user', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({
        'user': current_user.serialize
    })


@blueprint.route('/users', methods=['GET', 'POST'])
@blueprint.route('/users/<int:user_id>', methods=['DELETE', 'PUT', 'GET'])
@login_required
def users(user_id=None):
    request_data = request.get_json()
    if request.method == 'PUT':
        user = User.query.filter_by(id=user_id).first()
        user.first_name = request_data.get('firstName', None)
        user.last_name = request_data.get('lastName', None)
        user.username = request_data.get('userName', None)
        user.email = request_data.get('email', None)
        if request_data.get('password', None):
            user.password = request_data.get('password', None)
        user.save()
        return jsonify({
            'result': 'ok'
        })
    if request.method == 'DELETE':
        user = User.query.filter_by(id=user_id).first()
        if user.id == current_user.id:
            return jsonify({
                'message': 'You can\'t delete yourself'
            })
        user.delete()
        return jsonify({
            'result': 'ok'
        })
    if request.method == 'POST':
        print(request_data)
        User.create(first_name=request_data.get('firstName', None),
                    last_name=request_data.get('lastName', None),
                    username=request_data.get('userName', None),
                    email=request_data.get('email', None),
                    password=request_data.get('password', None),
                    active=True)
        return jsonify({
            'result': 'ok'
        })
    if request.method == 'GET':
        if user_id:
            return jsonify({
                'user': User.query.filter_by(id=user_id).first().serialize
            })
        else:
            users = User.query.all()
            return jsonify({
                'users': [user.serialize for user in users]
            })
