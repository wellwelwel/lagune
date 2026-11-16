from flask import Flask

from app.api import jobs
from app.settings import load_settings

app = Flask(__name__)
app.config.update(load_settings("settings.yaml"))
app.register_blueprint(jobs)
