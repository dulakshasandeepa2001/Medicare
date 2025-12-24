from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import User, Profile
from backend.utils import hash_password
from mongoengine.errors import NotUniqueError

@api_view(['POST'])
def register_user(request):
    data = request.data

    # 1️⃣ Basic input validation
    required_fields = ['username', 'email', 'phone', 'age', 'password', 'role']
    for field in required_fields:
        if field not in data:
            return Response({'error': f'{field} is required'}, status=400)

    # 2️⃣ Check if email already exists
    try:
        if User.objects(email=data['email']).first():
            return Response({'error': 'Email already exists'}, status=400)
    except:
        pass

    # 3️⃣ Validate role
    if data['role'] not in ['doctor', 'patient']:
        return Response({'error': 'Role must be doctor or patient'}, status=400)

    # 4️⃣ Create user
    try:
        user = User(
            username=data['username'],
            email=data['email'],
            phone=data['phone'],
            age=data['age'],
            password=hash_password(data['password']),
            role=data['role']
        )
        user.save()
        
        # Create associated profile
        profile = Profile(
            user_email=data['email'],
            full_name=data.get('username', ''),
            bio='',
            verified=False
        )
        profile.save()

        # 5️⃣ Response
        return Response({
            'message': 'User registered successfully',
            'email': user.email,
            'role': user.role,
            'username': user.username
        }, status=201)
        
    except NotUniqueError:
        return Response({'error': 'Email already exists'}, status=400)
    except Exception as e:
        return Response({'error': f'Registration failed: {str(e)}'}, status=500)