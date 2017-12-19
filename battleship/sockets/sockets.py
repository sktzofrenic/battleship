# -*- coding: utf-8 -*-
"""Socket connections"""
from flask import jsonify
from battleship.extensions import socketio
from battleship.utils import authenticated_only
from flask_socketio import send, emit, join_room, leave_room


@socketio.on('message')
@authenticated_only
def handle_message(message):
    print('received message: ' + message)


@socketio.on('join-room')
def join_room(json):
    print('received json: ' + str(json))
    print(type(json))
    join_room(json['room'])


@socketio.on('chat')
def chat(json):
    print('received chat json: ' + str(json))
    emit('chat', {'name': json['name'], 'message': json['message']}, broadcast=True)
