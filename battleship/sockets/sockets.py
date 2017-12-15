# -*- coding: utf-8 -*-
"""Socket connections"""
from battleship.extensions import socketio
from battleship.utils import authenticated_only
from flask_socketio import send, emit


@socketio.on('message')
@authenticated_only
def handle_message(message):
    print('received message: ' + message)


@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))
    emit('my event', str(json))
