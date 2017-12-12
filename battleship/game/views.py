from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required
from battleship.user.models import User

blueprint = Blueprint('dashboard', __name__, url_prefix='/dashboard', static_folder='../static')


@blueprint.route('/')
@login_required
def home():
    return render_template('admin/base.html')


@blueprint.route('/users')
@login_required
def users():
    users = User.query.all()
    return render_template('admin/users.html', users=users)
