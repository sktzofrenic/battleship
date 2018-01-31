import datetime as dt
import json

from battleship.database import Column, Model, SurrogatePK, db, reference_col, relationship


class Game(SurrogatePK, Model):
    """A game model for the battleship product."""

    __tablename__ = 'games'
    started_on = Column(db.DateTime, default=dt.datetime.utcnow)
    created_on = Column(db.DateTime, default=dt.datetime.utcnow)
    ended_on = Column(db.DateTime)
    is_offsite = Column(db.Boolean(), default=False)
    arsenal_timeout = Column(db.Integer)
    name = Column(db.String(255))
    game_code_set = relationship('GameCodeSet', backref='games')
    game_code_set_id = reference_col('game_code_sets', nullable=True)

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Game({id})>'.format(id=self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'game_code_set_id': self.game_code_set_id,
            'started_on': self.started_on.isoformat() if self.started_on else None,
            'ended_on': self.ended_on.isoformat() if self.ended_on else None,
            'created_on': self.created_on.isoformat() if self.created_on else None,
            'is_offsite': self.is_offsite,
            'arsenal_timeout': self.arsenal_timeout,
            'participants': [x.serialize for x in self.game_participants]
        }


class GameCodeSet(SurrogatePK, Model):
    """A name for a set of Game Codes"""

    __tablename__ = 'game_code_sets'
    name = Column(db.String(255))

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<GameCodeSet({id})>'.format(id=self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'game_codes': [x.serialize for x in self.game_codes]
        }


class GameCode(SurrogatePK, Model):
    """A game code and an associated action for that code."""

    __tablename__ = 'game_codes'
    name = Column(db.String(255))
    game_code_set = relationship('GameCodeSet', backref='game_codes')
    game_code_set_id = reference_col('game_code_sets', nullable=True)
    action = relationship('Action', backref='game_codes')
    action_id = reference_col('actions', nullable=True)

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<GameCode({id})>'.format(id=self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'action': self.action.serialize
        }


class Action(SurrogatePK, Model):
    """An action model that represents anything that could happen in a game."""

    __tablename__ = 'actions'
    name = Column(db.String(255))
    type_ = Column(db.String(255))
    data = Column(db.Text)

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Action({id})>'.format(id=self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'type_': self.type_,
            'data': json.loads(self.data) if self.data else None
        }


class GameEvent(SurrogatePK, Model):
    """An action model that represents anything that could happen in a game."""

    __tablename__ = 'game_events'
    created_on = Column(db.DateTime, default=dt.datetime.utcnow)
    game = relationship('Game', backref='game_events')
    game_id = reference_col('games', nullable=True)
    action = relationship('Action', backref='game_events')
    action_id = reference_col('actions', nullable=True)
    game_participant = relationship('GameParticipant', backref='game_events')
    game_participant_id = reference_col('game_participants', nullable=True)

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<GameEvent({id})>'.format(id=self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'created_on': self.created_on.isoformat() if self.created_on else None,
            'action': self.action.serialize
        }


class ChatEvent(SurrogatePK, Model):
    """An action model that represents a chat event in a game."""

    __tablename__ = 'chat_events'
    created_on = Column(db.DateTime, default=dt.datetime.utcnow)
    game = relationship('Game', backref='chat_events')
    game_id = reference_col('games', nullable=True)
    sender = Column(db.String(255))
    message = Column(db.String(255))
    channel = Column(db.String(255))

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<ChatEvent({id})>'.format(id=self.id)


class GameParticipant(SurrogatePK, Model):
    """An action model that represents a participant in a game."""

    __tablename__ = 'game_participants'
    game_role = Column(db.String(255))
    game = relationship('Game', backref='game_participants')
    name = Column(db.String(255))
    game_id = reference_col('games', nullable=True)
    user = relationship('User', backref='game_participant', uselist=False)  # One to one relationship
    user_id = reference_col('users', nullable=True)
    computer_player = relationship('ComputerPlayer', backref='game_participant', uselist=False)  # One to one relationship
    computer_player_id = reference_col('computer_players', nullable=True)

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<GameParticipant({id})>'.format(id=self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'game_role': self.game_role
        }


class ComputerPlayer(SurrogatePK, Model):
    """An action model that represents a participant in a game."""

    __tablename__ = 'computer_players'
    name = Column(db.String(255), unique=True, nullable=False)

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<ComputerPlayer({id})>'.format(id=self.id)


class ComputerPlayerEvents(SurrogatePK, Model):
    """An action model that represents anything that could happen in a game."""

    __tablename__ = 'computer_player_events'
    executed_at = Column(db.Integer)  # Number of seconds elapsed on the game clock.
    action = relationship('Action', backref='computer_player_events')
    action_id = reference_col('actions', nullable=True)
    computer_player = relationship('ComputerPlayer', backref='computer_player_events')
    computer_player_id = reference_col('computer_players', nullable=True)

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<ComputerPlayerEvents({id})>'.format(id=self.id)
