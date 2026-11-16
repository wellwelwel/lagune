import base64
import pickle

from flask import Blueprint, jsonify, request

jobs = Blueprint("jobs", __name__)
queue = []


@jobs.post("/jobs")
def enqueue():
    job = pickle.loads(base64.b64decode(request.form["payload"]))
    queue.append(job)
    return jsonify(position=len(queue)), 202
