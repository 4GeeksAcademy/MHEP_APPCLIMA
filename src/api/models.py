from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)  # ID autoincremental
    uid = db.Column(db.String(256), unique=True, nullable=True)  # ID único proporcionado por Firebase
    email = db.Column(db.String(120), unique=True, nullable=False)  # Correo electrónico único
    email_verified = db.Column(db.Boolean, nullable=False)  # Booleano para verificar el email
    password = db.Column(db.String(80), unique=False, nullable=False)  # Contraseña del usuario
    is_active = db.Column(db.Boolean, unique=False, nullable=False)  # Estado del usuario
    display_name = db.Column(db.String(120), nullable=False)  # Nombre a mostrar
    access_token = db.Column(db.Text, nullable=False)  # Token de acceso proporcionado

    def __init__(self, uid, email, email_verified, password, is_active, display_name, access_token):
        self.uid = uid
        self.email = email
        self.email_verified = email_verified
        self.password = password
        self.is_active = is_active
        self.display_name = display_name
        self.access_token = access_token

    def serialize(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "email": self.email,
            "emailVerified": self.email_verified,
            "password": self.password,
            "isActive": self.is_active,
            "displayName": self.display_name,
            "accessToken": self.access_token
        }
