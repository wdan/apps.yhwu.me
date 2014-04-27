#!/usr/bin/env python
# -*- coding: utf-8 -*-

import flask
app = flask.Flask(__name__)
app.debug = True


@app.route('/')
def hello():
    return "Hello world!"
