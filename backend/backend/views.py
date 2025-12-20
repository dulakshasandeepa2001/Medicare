from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .utils import hash_password

@api_view(['POST'])
def register_user(request):
    data = request.data

    # 1️⃣ Basic input validation
    required_fields = ['name', 'email', 'phone', 'age', 'password', 'role']
    for field in required_fields:
        if field not in data:
            return Response({'error': f'{field} is required'}, status=400)

    # 2️⃣ Check if email already exists
    if User.objects(email=data['email']).first():
        return Response({'error': 'Email already exists'}, status=400)

    # 3️⃣ Validate role
    if data['role'] not in ['doctor', 'patient']:
        return Response({'error': 'Role must be doctor or patient'}, status=400)

    # 4️⃣ Create user
    user = User(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        age=data['age'],
        password=hash_password(data['password']),
        role=data['role']
    )
    user.save()

    # 5️⃣ Response
    return Response({
        'message': 'User registered successfully',
        'email': user.email,
        'role': user.role
    }, status=201)
