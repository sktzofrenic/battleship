from flask import Blueprint, flash, redirect, render_template, request, url_for, jsonify
from flask_login import login_required, current_user
from battleship.user.models import User

blueprint = Blueprint('api', __name__, url_prefix='/api/v1', static_folder='../static')


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
