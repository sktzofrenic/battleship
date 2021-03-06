# -*- coding: utf-8 -*-
"""User models."""
import datetime as dt

from flask_login import UserMixin

from battleship.database import Column, Model, SurrogatePK, db, reference_col, relationship
from battleship.extensions import bcrypt

role_associations = db.Table('users_roles',
                             db.Column('role_id', db.Integer, db.ForeignKey('roles.id')),
                             db.Column('user_id', db.Integer, db.ForeignKey('users.id')))

permission_associations = db.Table('permissions_roles',
                                   db.Column('permission_id', db.Integer, db.ForeignKey('permissions.id')),
                                   db.Column('role_id', db.Integer, db.ForeignKey('roles.id')))


class Permission(SurrogatePK, Model):
    """A permission for a role."""

    __tablename__ = 'permissions'
    permission = db.Column(db.String(50))

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<RolPermissione({id})>'.format(name=self.id)


class Role(SurrogatePK, Model):
    """A role for a user."""

    __tablename__ = 'roles'
    name = Column(db.String(80), unique=True, nullable=False)
    permissions = relationship("Permission",
                               secondary=permission_associations,
                               backref="roles")

    def __init__(self, name, **kwargs):
        """Create instance."""
        db.Model.__init__(self, name=name, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Role({name})>'.format(name=self.name)


class User(UserMixin, SurrogatePK, Model):
    """A user of the app."""

    __tablename__ = 'users'
    username = Column(db.String(80), unique=True, nullable=False)
    email = Column(db.String(80), unique=True, nullable=False)
    #: The hashed password
    password = Column(db.Binary(128), nullable=True)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    first_name = Column(db.String(30), nullable=True)
    last_name = Column(db.String(30), nullable=True)
    active = Column(db.Boolean(), default=False)
    is_admin = Column(db.Boolean(), default=False)
    roles = relationship("Role",
                         secondary=role_associations,
                         backref="users")

    def __init__(self, username, email, password=None, **kwargs):
        """Create instance."""
        db.Model.__init__(self, username=username, email=email, **kwargs)
        if password:
            self.set_password(password)
        else:
            self.password = None

    @property
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'email': self.email,
            'roles': self.display_roles,
            'is_active': self.is_active,
            'is_admin': self.is_admin
        }

    @property
    def display_roles(self):
        roles = ''
        for role in self.roles:
            roles += role.name
        return roles

    def has_role(self, role):
        user_roles = [x.name for x in self.roles]
        return True if role in user_roles else False

    def can(self, permission):
        permissions = []
        for role in self.roles:
            for permission in role:
                list(set(permissions.append(permission.permission)))
        return True if permission in permissions else False

    def set_password(self, password):
        """Set password."""
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, value):
        """Check password."""
        return bcrypt.check_password_hash(self.password, value)

    @property
    def full_name(self):
        """Full user name."""
        return '{0} {1}'.format(self.first_name, self.last_name)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<User({username!r})>'.format(username=self.username)
