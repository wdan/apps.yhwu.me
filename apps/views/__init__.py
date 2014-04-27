#!/usr/bin/env python
# -*- coding: utf-8 -*-
from apps import app


@app.route('/')
def apps_homepage():
    return "Coming soon..."
