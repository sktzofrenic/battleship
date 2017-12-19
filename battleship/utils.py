# -*- coding: utf-8 -*-
"""Helper utilities and decorators."""
import functools

from flask import flash
from flask import request
from flask_login import current_user
from flask_socketio import disconnect

import datetime as dt


def flash_errors(form, category='warning'):
    """Flash all errors for a form."""
    for field, errors in form.errors.items():
        for error in errors:
            flash('{0} - {1}'.format(getattr(form, field).label.text, error), category)


def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapped


def try_parsing_date(text):
    if not text:
        return None
    for fmt in ('%Y-%m-%d %H:%M', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d', '%-m/%-d/%Y', '%m/%d/%Y'):
        try:
            return dt.datetime.strptime(text, fmt)
        except ValueError:
            pass
    raise ValueError('no valid date format found')
