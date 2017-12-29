# -*- coding: utf-8 -*-
"""Socket connections"""
from flask import jsonify
from battleship.extensions import socketio
from battleship.utils import authenticated_only
from flask_socketio import send, emit, join_room, leave_room
from battleship.game.models import Game
import datetime as dt


@socketio.on('message')
@authenticated_only
def handle_message(message):
    print('received message: ' + message)


@socketio.on('join-room')
def join_room(json):
    print('received json: ' + str(json))
    join_room(json['room'])


@socketio.on('join-game')
def join_room(json):
    print('received join json: ' + str(json))
    emit('join-game', {'id': json['id']}, broadcast=True)


@socketio.on('chat')
def chat(json):
    print('received chat json: ' + str(json))
    emit('chat', {'name': json['name'], 'message': json['message'], 'room': json['room']}, broadcast=True)


@socketio.on('ship-placed')
def chat(json):
    print('received ship placed json: ' + str(json))
    emit('ship-placed', json, broadcast=True)


@socketio.on('end-game')
def end_game(json):
    print('received chat json: ' + str(json))
    game = Game.query.filter_by(id=json['id']).first()
    game.ended_on = dt.datetime.utcnow()
    game.save()
    emit('end-game', {'id': game.id}, broadcast=True)


@socketio.on('create-game')
def create_game(json):
    print('received chat json: ' + str(json))
    game = Game.query.filter_by(id=json['id']).first()
    emit('create-game', {'game': game.serialize}, broadcast=True)
