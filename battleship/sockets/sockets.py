# -*- coding: utf-8 -*-
"""Socket connections"""
from flask import jsonify
from battleship.extensions import socketio
from battleship.utils import authenticated_only
from flask_socketio import send, emit, join_room, leave_room
from battleship.game.models import Game, GameParticipant, GameEvent, Action
import datetime as dt
import json as js


@socketio.on('message')
@authenticated_only
def handle_message(message):
    print('received message: ' + message)


@socketio.on('join-room')
def join_room(json):
    print('received json: ' + str(json))
    join_room(json['room'])


@socketio.on('join-game')
def join_game(json):
    print('received join json: ' + str(json))
    emit('join-game', json, broadcast=True)


@socketio.on('leave-game')
def leave_game(json):
    participant = GameParticipant.query.filter_by(game_id=json['gameId'], name=json['clientName'], game_role=str(json['participantType'])).first()
    participant.delete()
    emit('leave-game', json, broadcast=True)


@socketio.on('chat')
def chat(json):
    print('received chat json: ' + str(json))
    emit('chat', json, broadcast=True)


@socketio.on('ship-placed')
def ship_placed(json):
    print('received ship placed json: ' + str(json))
    game = Game.query.filter_by(id=json['gameId']).first()
    action = Action.create(name='Ship Placed', type_='7', data=js.dumps(json['fullShip']))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('ship-placed', json, broadcast=True)


@socketio.on('reset-ships')
def reset_ships(json):
    emit('reset-ships', json, broadcast=True)


@socketio.on('arsenal-change')
def arsenal_change(json):
    emit('arsenal-change', json, broadcast=True)


@socketio.on('end-game')
def end_game(json):
    print('received chat json: ' + str(json))
    emit('end-game', json, broadcast=True)


@socketio.on('start-game')
def start_game(json):
    emit('start-game', json, broadcast=True)


@socketio.on('add-minute')
def add_minute(json):
    emit('add-minute', json, broadcast=True)


@socketio.on('subtract-minute')
def subtract_minute(json):
    emit('subtract-minute', json, broadcast=True)


@socketio.on('start-timer')
def start_timer(json):
    print('received ship placed json')
    emit('start-timer', json, broadcast=True)


@socketio.on('player-name')
def player_name(json):
    game = Game.query.filter_by(id=json['gameId']).first()
    print(str(json))
    requested_aleady_used = [x for x in game.game_participants if x.game_role == json['participantType']]
    if not requested_aleady_used or json['participantType'] == 4:
        game.game_participants.append(GameParticipant.create(game_role=json['participantType'], name=json['clientName']))
        game.save()
    else:
        json['already_taken'] = True
    emit('player-name', json, broadcast=True)


@socketio.on('pause-timer')
def pause_timer(json):
    emit('pause-timer', json, broadcast=True)


@socketio.on('weapon-miss')
def weapon_miss(json):
    emit('weapon-miss', json, broadcast=True)


@socketio.on('weapon-hit')
def weapon_hit(json):
    print('weapon hit json {}'.format(str(json)))
    emit('weapon-hit', json, broadcast=True)


@socketio.on('radar-used')
def radar_used(json):
    emit('radar-used', json, broadcast=True)


@socketio.on('successful-game-code')
def successful_game_code(json):
    emit('successful-game-code', json, broadcast=True)


@socketio.on('bad-game-code')
def bad_game_code(json):
    emit('bad-game-code', json, broadcast=True)


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
