#!/usr/bin/env python
from apps import app
from werkzeug.contrib.fixers import ProxyFix

if __name__ == "main":
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.run()
