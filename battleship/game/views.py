from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required

blueprint = Blueprint('game', __name__, url_prefix='/games', static_folder='../static')


@blueprint.route('/')
@login_required
def games():
    return render_template('public/home.html')
