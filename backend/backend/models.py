from mongoengine import Document, StringField, EmailField, IntField
from datetime import datetime

class User(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    phone = StringField(required=True, max_length=15)
    age = IntField(required=True)
    password = StringField(required=True)
    role = StringField(required=True, choices=['patient', 'doctor', 'admin'])
    created_at = StringField(default=datetime.utcnow().isoformat)