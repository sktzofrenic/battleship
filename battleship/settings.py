# -*- coding: utf-8 -*-
"""Application configuration."""
import os


class Config(object):
    """Base configuration."""

    SECRET_KEY = os.environ.get('BATTLESHIP_SECRET', 'secret-key')  # TODO: Change me
    APP_DIR = os.path.abspath(os.path.dirname(__file__))  # This directory
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))
    BCRYPT_LOG_ROUNDS = 13
    DEBUG_TB_ENABLED = False  # Disable Debug toolbar
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    CACHE_TYPE = 'simple'  # Can be "memcached", "redis", etc.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WEBPACK_MANIFEST_PATH = 'webpack/manifest.json'
    WEBPACK_ASSETS_URL = "/static/build/"


class ProdConfig(Config):
    """Production configuration."""

    ENV = 'prod'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgres://njmprneafciwlm:155ab57d0f979a4c117a2d8718caa4933c0a65a5cbd086a07e76b3e6ee9d5263@ec2-54-83-203-198.compute-1.amazonaws.com:5432/depegtamdcggjh')
    DEBUG_TB_ENABLED = False  # Disable Debug toolbar
    WEBPACK_ASSETS_URL = "/static/build/"


class DevConfig(Config):
    """Development configuration."""

    ENV = 'dev'
    DEBUG = True
    DB_NAME = 'dev.db'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgres://njmprneafciwlm:155ab57d0f979a4c117a2d8718caa4933c0a65a5cbd086a07e76b3e6ee9d5263@ec2-54-83-203-198.compute-1.amazonaws.com:5432/depegtamdcggjh')
    DEBUG_TB_ENABLED = False
    CACHE_TYPE = 'simple'  # Can be "memcached", "redis", etc.
    WEBPACK_ASSETS_URL = "http://myground.org:5001/static/build/"


class TestConfig(Config):
    """Test configuration."""

    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    BCRYPT_LOG_ROUNDS = 4  # For faster tests; needs at least 4 to avoid "ValueError: Invalid rounds"
    WTF_CSRF_ENABLED = False  # Allows form testing
