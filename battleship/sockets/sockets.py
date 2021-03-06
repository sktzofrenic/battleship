# -*- coding: utf-8 -*-
"""Socket connections"""
from flask import jsonify
from battleship.extensions import socketio
from battleship.utils import authenticated_only
from flask_socketio import send, emit, join_room, leave_room
from battleship.game.models import Game, GameParticipant, GameEvent, Action, ChatEvent, QuickChatCode
import datetime as dt
import json as js
import re


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
    game = Game.query.filter_by(id=json['gameId']).first()
    if json['p1']:
        player_number = 'Player 1'
    elif json['p2']:
        player_number = 'Player 2'
    elif json['participantType'] == 3:
        player_number = 'Game Master'
    elif json['participantType'] == 4:
        player_number = 'Observer'
    action = Action.create(name='Player Joined Game', type_='9', data=js.dumps('{} joined as {}'.format(json['clientName'], player_number)))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('join-game', json, broadcast=True)


@socketio.on('leave-game')
def leave_game(json):
    participant = GameParticipant.query.filter_by(game_id=json['gameId'], name=json['clientName'], game_role=str(json['participantType'])).first()
    participant.delete()

    game = Game.query.filter_by(id=json['gameId']).first()
    action = Action.create(name='Player Left Game', type_='8', data=js.dumps(json['clientName'] + ' left the game'))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('leave-game', json, broadcast=True)


@socketio.on('chat')
def chat(json):
    print('received chat json: ' + str(json))
    if json['room'] != 'public':
        chat_event = ChatEvent.create(game_id=json['room'], sender=json['name'], message=json['message'], channel=json['recipients'])
        json['message'] = json['message'] + ' '
        matches = re.findall(r'!(.*?) ', json['message'])
        for match in matches:
            check = QuickChatCode.query.filter_by(code=match).first()
            if check:
                json['message'] = json['message'].replace('!' + match, check.text)
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
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='Ship Placed', type_='10', data=js.dumps('GM Reset Ship Placements'))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('reset-ships', json, broadcast=True)


@socketio.on('remove-one-ship')
def reset_ship(json):
    game = Game.query.filter_by(id=json['gameId']).first()
    action = Action.create(name='Remove One Ship', type_='26', data=js.dumps(json['shipCoord']))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('remove-one-ship', json, broadcast=True)


@socketio.on('arsenal-change')
def arsenal_change(json):
    game = Game.query.filter_by(id=json['gameId']).first()
    if json['modify'] == 'add':
        action_name = 'GM manually added arsenal {} for player {}'.format(json['item'], json['participantType'])
    if json['modify'] == 'subtract':
        action_name = 'GM manually subtracted an arsenal {} for player {}'.format(json['item'], json['participantType'])
    action = Action.create(name=action_name, type_='11', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('arsenal-change', json, broadcast=True)


@socketio.on('start-game')
def start_game(json):
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='Game Begins', type_='13', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('start-game', json, broadcast=True)


@socketio.on('add-minute')
def add_minute(json):
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='GM Adds minute to game clock', type_='14', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('add-minute', json, broadcast=True)


@socketio.on('subtract-minute')
def subtract_minute(json):
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='GM Subtracts minute from game clock', type_='14', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('subtract-minute', json, broadcast=True)


@socketio.on('start-timer')
def start_timer(json):
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='GM Starts Game Clock', type_='15', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
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
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='GM Pauses Game Clock', type_='16', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('pause-timer', json, broadcast=True)


@socketio.on('weapon-miss')
def weapon_miss(json):
    game = Game.query.filter_by(id=json['gameId']).first()
    action = Action.create(name='{} fired and missed'.format(json['player']), type_='17', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('weapon-miss', json, broadcast=True)


@socketio.on('update-stats')
def weapon_miss(json):
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='Final Game Stats', type_='24', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)


@socketio.on('weapon-hit')
def weapon_hit(json):
    print('weapon hit json {}'.format(str(json)))
    game = Game.query.filter_by(id=json['hit']['gameId']).first()
    action = Action.create(name='{} fired and hit the enemy'.format(json['hit']['player']), type_='18', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('weapon-hit', json, broadcast=True)


@socketio.on('radar-used')
def radar_used(json):
    game = Game.query.filter_by(id=json['gameId']).first()
    action = Action.create(name='{} used their radar'.format(json['player']), type_='19', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('radar-used', json, broadcast=True)


@socketio.on('successful-game-code')
def successful_game_code(json):
    game = Game.query.filter_by(id=json['gameId']).first()
    action = Action.create(name='{} successfully used game code {}'.format(json['player'], json['gameCode']), type_='20', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('successful-game-code', json, broadcast=True)


@socketio.on('bad-game-code')
def bad_game_code(json):
    game = Game.query.filter_by(id=json['gameId']).first()
    action = Action.create(name='{} was punished for trying game code {}'.format(json['player'], json['gameCode']), type_='21', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('bad-game-code', json, broadcast=True)


@socketio.on('end-game')
def end_game(json):
    print('game end json: ' + str(json))
    game = Game.query.filter_by(id=json['id']).first()
    game.ended_on = dt.datetime.utcnow()
    game.save()
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='Game ended', type_='22', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('end-game', json, broadcast=True)


@socketio.on('create-game')
def create_game(json):
    print('received chat json: ' + str(json))
    game = Game.query.filter_by(id=json['id']).first()
    action = Action.create(name='Game created', type_='23', data=js.dumps(json))
    game_event = GameEvent.create(created_on=dt.datetime.utcnow(),
                                  game_id=game.id,
                                  action_id=action.id)
    emit('create-game', {'game': game.serialize}, broadcast=True)
