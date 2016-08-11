#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
from flask import render_template
from flask import request
from apps import app
from apps.models.crawler import Crawler


@app.route('/')
def apps_homepage():
    return "Coming soon..."


@app.route('/colorwheel')
def colorwheel():
    return render_template('colorwheel.html')


@app.route('/weather')
def weather():
    return render_template('weather.html')


@app.route('/weather_data', methods=['POST'])
def weather_data():
    date = request.form['date']
    dateTuple = date.split('/')
    daily_data = Crawler.get_daily_data(int(dateTuple[1]), int(dateTuple[0]), int(dateTuple[2]))
    res = {}
    res['sunshine'] = daily_data[0]
    res['wind'] = daily_data[1]
    res = json.dumps(res)
    return res
