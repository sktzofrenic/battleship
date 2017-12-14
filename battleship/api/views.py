from flask import Blueprint, flash, redirect, render_template, request, url_for, jsonify
from flask_login import login_required, current_user
from battleship.user.models import User
from battleship.game.models import GameCode, GameCodeSet, Action

blueprint = Blueprint('api', __name__, url_prefix='/api/v1', static_folder='../static')


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


@blueprint.route('/users', methods=['GET', 'POST'])
@blueprint.route('/users/<int:user_id>', methods=['DELETE', 'PUT'])
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
    users = User.query.all()
    return jsonify({
        'users': [user.serialize for user in users]
    })
