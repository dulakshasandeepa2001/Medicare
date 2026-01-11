"""
Django settings for backend project.
"""

from pathlib import Path
from datetime import timedelta
import os

# -----------------------------------------
# BASE DIRECTORY
# -----------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------------------
# SECURITY
# -----------------------------------------
SECRET_KEY = 'django-insecure-REPLACE_THIS_WITH_YOUR_SECRET_KEY'
DEBUG = True
ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']  # Allow all for development

# -----------------------------------------
# APPLICATIONS
# -----------------------------------------
INSTALLED_APPS = [
    'api',
    'rest_framework',
    'corsheaders',
]

# -----------------------------------------
# MIDDLEWARE
# -----------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -----------------------------------------
# URL CONFIGURATION
# -----------------------------------------
ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# -----------------------------------------
# INTERNATIONALIZATION
# -----------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -----------------------------------------
# STATIC FILES
# -----------------------------------------
STATIC_URL = 'static/'

# -----------------------------------------
# DEFAULT AUTO FIELD
# -----------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -----------------------------------------
# REST FRAMEWORK CONFIG
# -----------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'UNAUTHENTICATED_USER': None,
    'UNAUTHENTICATED_TOKEN': None,
}

# -----------------------------------------
# CORS SETTINGS
# -----------------------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# -----------------------------------------
# MONGOENGINE CONNECTION
# -----------------------------------------
from mongoengine import connect, disconnect

try:
    disconnect(alias='default')
    connect(
        db="Cluster1",
        host="mongodb+srv://dulakshamedicare:qwe1234@cluster1.8ck7e4w.mongodb.net/?appName=Cluster1",
        alias="default",
        serverSelectionTimeoutMS=3000,
        retryWrites=False,
        connect=False
    )
    print("\n" + "="*70)
    print("✅ SUCCESS: MongoDB Connection Configured!")
    print("="*70)
    print("📊 Database: Cluster1")
    print("🔗 Host: cluster1.8ck7e4w.mongodb.net")
    print("✔️ Status: Ready to Connect")
    print("="*70 + "\n")
    
except Exception as e:
    print("\n" + "="*70)
    print("⚠️ WARNING: MongoDB Configuration Issue")
    print("="*70)
    print(f"Error: {str(e)}")
    print("Note: Using MongoEngine in lazy mode")
    print("="*70 + "\n")