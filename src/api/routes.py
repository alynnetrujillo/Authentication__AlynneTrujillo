"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, current_user
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Fetch user profile for the logged-in user."""
    if not current_user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(current_user.serialize()), 200  


@api.route('/sign_up', methods=['POST'])
def sign_up():
    processed_params = request.get_json()
    print("params", processed_params)

    user_exists = User.query.filter_by(email=processed_params["email"]).first()
    if user_exists:
        return jsonify("User already exists"), 400
    
    #create new user now

    new_user = User(email=processed_params['email'], is_active=True)
    new_user.set_password(processed_params['password'])

    db.session.add(new_user)
    db.session.commit()
    print("User created", new_user.email)

    return jsonify([{"message": "User has been created"}]), 200

@api.route('/login', methods=['POST'])
def create_token():

    email = request.json.get("email", None)
    password = request.json.get("password", None)
    print("email", email)

    user = User.query.filter_by(email=email).one_or_none()

    if not user or not user.check_password(password):
        return jsonify({"message:": "Incorrect email or password"}), 401
    
    access_token = create_access_token(identity=user)
    return jsonify({"access_token": access_token, "user_id": user.id})