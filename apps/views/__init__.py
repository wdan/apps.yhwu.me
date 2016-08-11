#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import render_template
from apps import app


@app.route('/')
def apps_homepage():
    return "Coming soon..."


@app.route('/colorwheel')
def colorwheel():
    return render_template('colorwheel.html')

@app.route('/lm')
def lm():
    return render_template('lm.html')
