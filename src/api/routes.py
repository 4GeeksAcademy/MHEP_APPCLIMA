from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from api.utils import APIException
from flask_cors import CORS
import psycopg2

api = Blueprint('api', __name__)

# Configuración de CORS
CORS(api, resources={r"/api/*": {"origins": "*"}})

@api.after_request
def after_request(response):
    # Headers para CORS
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

@api.route('/api/users', methods=['GET', 'POST', 'OPTIONS'])
def manage_users():
    if request.method == 'OPTIONS':
        # Responder a preflight requests
        response = jsonify({"message": "Preflight request received"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
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
            return jsonify({"message": "Usuario creado exitosamente", "user": user.serialize()}), 201
        except psycopg2.errors.StringDataRightTruncation as e:
            db.session.rollback()
            return jsonify({"error": "Datos demasiado largos para algunos campos", "details": str(e)}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Error al crear el usuario", "details": str(e)}), 500

