from django.contrib.auth.hashers import make_password, check_password

def hash_password(password):
    """Hashes a plain text password."""
    return make_password(password)
def verify_password(password,hashed):
    """Verifies a plain text password against a hashed password."""
    return check_password(password, hashed)
