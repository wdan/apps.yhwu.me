#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask, url_for
import os

app = Flask(__name__)
app.config['FREEZER_DESTINATION'] = os.path.dirname(os.path.abspath(__file__))+'/../build'
app.jinja_env.globals['static'] = (
    lambda filename: url_for('static', filename = filename)
)
app.debug = True

import views
