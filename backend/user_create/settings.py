"""
Django settings for backend project.
"""

from pathlib import Path
from decouple import config

# -----------------------------------------
# BASE DIRECTORY
# -----------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------------------
# SECURITY
# -----------------------------------------
SECRET_KEY = 'django-insecure-REPLACE_THIS_WITH_YOUR_SECRET_KEY'
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
    'user_create',
    'taskcreate',  # <-- add this line so Django recognizes backend.models

]
# -----------------------------------------
# MIDDLEWARE
# -----------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -----------------------------------------
# URL CONFIGURATION
# -----------------------------------------
ROOT_URLCONF = 'user_create.urls'

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

WSGI_APPLICATION = 'user_create.wsgi.application'

# -----------------------------------------
# SUPABASE DATABASE CONFIGURATION
# -----------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': config('SUPABASE_DB_PASSWORD'),
        'HOST': 'db.yuemlsjtzdpgclgnlogg.supabase.co',
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}


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

print("\n" + "="*70)
print("✅ SUCCESS: Supabase PostgreSQL Database Configured!")
print("="*70)
print("🗄️ Database: PostgreSQL")
print("🔗 Host: Supabase")
print("✔️ Status: Ready to Connect")
print("="*70 + "\n")