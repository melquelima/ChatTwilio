from flask import Flask
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config.from_object('config')
cors = CORS(app)
db = SQLAlchemy(app)



from app.controllers import default

