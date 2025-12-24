from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField
from datetime import datetime

class User(Document):
    """User model for MongoDB using MongoEngine"""
    username = StringField(max_length=100, required=True)
    email = EmailField(unique=True, required=True)
    password = StringField(required=True)
    phone = StringField(max_length=20, required=True)
    age = StringField(max_length=3, required=True)
    role = StringField(choices=['doctor', 'patient'], required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'users',
        'indexes': ['email']
    }
    
    def __str__(self):
        return self.username


class Profile(Document):
    """User Profile model for MongoDB"""
    user_email = EmailField(unique=True, required=True)
    full_name = StringField(max_length=300, default='')
    bio = StringField(max_length=300, default='')
    image = StringField(default='default.jpg')
    verified = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'profiles',
        'indexes': ['user_email']
    }
    
    def __str__(self):
        return self.full_name if self.full_name else self.user_email