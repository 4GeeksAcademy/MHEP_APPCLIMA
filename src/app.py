"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.models import db, User
from datetime import datetime, timedelta
import psycopg2
import bcrypt
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests
# from models import Person

CLIENT_ID="app-de-clima-cd5ef"

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False



# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


# @app.errorhandler(APIException)
# def handle_invalid_usage(error):
#     return jsonify(error.to_dict()), error.status_code

# # generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/api/users', methods=['GET', 'POST', 'OPTIONS'])
def manage_users():
    if request.method == 'OPTIONS':
        # Responder a preflight requests
        response = jsonify({"message": "Preflight request received"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        print("entro")
        return response, 200

    if request.method == 'GET':
        # Obtener todos los usuarios
        users = User.query.all()
        return jsonify([user.serialize() for user in users]), 200

    if request.method == 'POST':
        data = request.get_json()

        # Validar campos obligatorios
        required_fields = ['uid', 'email', 'emailVerified', 'password', 'isActive', 'displayName', 'accessToken']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"El campo '{field}' es obligatorio."}), 400

        # Validación de datos desde Firebase
        try:
            user = User(
                uid=data['uid'][:256],
                email=data['email'][:120],
                email_verified=data['emailVerified'],
                password=data['password'],
                is_active=data['isActive'],
                display_name=data['displayName'][:255],
                access_token=data['accessToken'][:1000]
            )
            db.session.add(user)
            db.session.commit()
            response=jsonify({"message": "Usuario creado exitosamente", "user": user.serialize()})
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
            return response, 201
        except psycopg2.errors.StringDataRightTruncation as e:
            db.session.rollback()
            return jsonify({"error": "Datos demasiado largos para algunos campos", "details": str(e)}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Error al crear el usuario", "details": str(e)}), 500

@app.route('/api/create-password', methods=['POST', 'OPTIONS'])
def create_password():
    response = jsonify({"message": "Preflight request received"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    if request.method == 'OPTIONS':
        
        return response, 200

    try:
        bearer,token = request.headers.get("Authorization").split()
        print("/" + token + "/")  # Depuración

        if not token:
            return jsonify({"error": "Token no proporcionado"}), 401

        # Decodificar el token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        print(str(idinfo))
        # Resto de la lógica...
        db.session.query(User).\
        filter(User.uid == idinfo["user_id"]).\
        update({'password': request.get_json()["new_password"]})
        db.session.commit()

    except Exception as e:
        print(f"Error en el endpoint: {e}")
        response = jsonify({"error": "Error en el servidor", "details": str(e)})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        return response, 500


        
       

# any other endpoint will try to serve it like a static file
# @app.route('/<path:path>', methods=['GET'])
# def serve_any_other_file(path):
#     if not os.path.isfile(os.path.join(static_file_dir, path)):
#         path = 'index.html'
#     response = send_from_directory(static_file_dir, path)
#     response.cache_control.max_age = 0  # avoid cache memory
#     return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
