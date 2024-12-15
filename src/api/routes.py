# from flask import Flask, request, jsonify, Blueprint
# from api.models import db, User
# from api.utils import APIException
# from openai import OpenAI

# key = ""

# cliente = OpenAI(api_key = key)


# messages = [
#     {"role": "system", "content": "Eres un asistente del clima que recomienda actividades segun las condiciones del mismo"}
# ]

# user_input = input ("usuario: ")
# messages.append({"role": "user", "content": user_input})

# completion = cliente.chat.completions.create(
#     model="gpt-4o-mini",
#     messages=messages
# )
# print(completion)
# assistant_response = completion.choices[0].message.content
# print(f"Assistant: {assistant_response}")


# @api.route('/api/users', methods=['GET', 'POST', 'OPTIONS'])
# def manage_users():
#     if request.method == 'OPTIONS':
#         # Responder a preflight requests
#         response = jsonify({"message": "Preflight request received"})
#         response.headers.add("Access-Control-Allow-Origin", "*")
#         response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
#         response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
#         print("entro")
#         return response, 200

#     if request.method == 'GET':
#         # Obtener todos los usuarios
#         users = User.query.all()
#         return jsonify([user.serialize() for user in users]), 200

#     if request.method == 'POST':
#         data = request.get_json()

#         # Validar campos obligatorios
#         required_fields = ['uid', 'email', 'emailVerified', 'password', 'isActive', 'displayName', 'accessToken']
#         for field in required_fields:
#             if field not in data:
#                 return jsonify({"error": f"El campo '{field}' es obligatorio."}), 400

#         # Validación de datos desde Firebase
#         try:
#             user = User(
#                 uid=data['uid'][:256],
#                 email=data['email'][:120],
#                 email_verified=data['emailVerified'],
#                 password=data['password'],
#                 is_active=data['isActive'],
#                 display_name=data['displayName'][:255],
#                 access_token=data['accessToken'][:1000]
#             )
#             db.session.add(user)
#             db.session.commit()
#             return jsonify({"message": "Usuario creado exitosamente", "user": user.serialize()}), 201
#         except psycopg2.errors.StringDataRightTruncation as e:
#             db.session.rollback()
#             return jsonify({"error": "Datos demasiado largos para algunos campos", "details": str(e)}), 400
#         except Exception as e:
#             db.session.rollback()
#             return jsonify({"error": "Error al crear el usuario", "details": str(e)}), 500

