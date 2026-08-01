"""
Django settings for medicare_project project.
"""

from pathlib import Path
from decouple import config
import socket

# -----------------------------------------
# BASE DIRECTORY
# -----------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------------------
# SECURITY
# -----------------------------------------
SECRET_KEY = 'django-insecure-o(j5nzv3qn3cqu-*lgjl4og(5q4i)a*j_yr6rxk0z_&-3e*gpx'
DEBUG = True
ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']

# -----------------------------------------
# APPLICATIONS
# -----------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'accounts',
    'taskcreate',
]

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# -----------------------------------------
# MIDDLEWARE
# -----------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -----------------------------------------
# URL & WSGI CONFIGURATION
# -----------------------------------------
ROOT_URLCONF = 'medicare_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'medicare_project.wsgi.application'

# -----------------------------------------
# DATABASE CONFIGURATION WITH FALLBACK
# -----------------------------------------
def is_supabase_reachable():
    try:
        socket.gethostbyname('db.wixgbvdcwteghicynwvz.supabase.co')
        return True
    except socket.gaierror:
        return False

if is_supabase_reachable():
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'postgres',
            'USER': 'postgres',
            'PASSWORD': config('SUPABASE_DB_PASSWORD', default=''),
            'HOST': 'db.wixgbvdcwteghicynwvz.supabase.co',
            'PORT': '5432',
            'OPTIONS': {
                'sslmode': 'require',
            },
        }
    }
    print("[INFO] Connected to Supabase PostgreSQL Database!")
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    print("[INFO] Offline/Sandbox mode: Falling back to local SQLite Database!")

# -----------------------------------------
# PASSWORD VALIDATION
# -----------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

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
    "https://yuemlsjtzdpgclgnlogg.supabase.co",
]

CORS_ALLOW_CREDENTIALS = True