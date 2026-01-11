from rest_framework.decorators import api_view #meken wennne api view ekak hadanna puluwan,api view kiynne django rest framework eke view ekak hadanna use karana decorator ekak
from rest_framework.response import Response #meken wennne api view ekak return karanna puluwan response ekak
from django.http import JsonResponse #meken wennne json response ekak return karanna puluwan
import json #meken wennne json data ekak handle karanna puluwan, handle krnwa kiynne json data ekak load krnna, dump krnna wage kriyawalata
from user_create.models import User #meken wennne User model ekata access karanna puluwan
from django.core.exceptions import ValidationError #meken wennne validation error ekak handle karanna puluwan,validation error thiyenne data tika valid naththam raise krnna puluwan error ekak
from django.contrib.auth.hashers import make_password #meken wennne password ekak hash karanna puluwan

@api_view(['POST']) #meken wennne me view ekata POST request ekakma allow krnna,@api_view kiynne me view ekata api view ekak hadanna use krnna decorator ekak
def create_user(request): #meken wennne user create karanna puluwan function ekak,meke thama functione ek hadanne
    """Create a new user with Supabase PostgreSQL"""
    try: #meken wennne try block ekak start krnna,try block ekak thama error handling krnna use krnna
        data = json.loads(request.body) #meken wennne request body eke thiyena json data eka load krnna,puluwan wenne json data eka python dictionary ekakata convert krnna,data kiynne dictionary ekak
        username = data.get('username') #
        email = data.get('email')
        password = data.get('password')
        phone = data.get("phone")
        age = data.get("age")
        role = data.get("role")
        
        # Validate required fields
        if not all([username, email, password, phone, age, role]): #if not all
            return JsonResponse({'error': 'All fields are required'}, status=400) #return krnna json response ekak,error kiynne all fields are required,status 400 kiynne bad request ekak
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)
        
        # Create a new user instance
        user = User.objects.create( #meken wennne new user instance ekak hadanna puluwan data base eke,User.objects.create kiynne new user ekak create krnna use krnna method ekak,methnin thama models.py ekath ekk connect wela data save wenn orm ekat ynne]
                                   
            username=username,
            email=email,
            password=make_password(password),  # Hash the password
            phone=phone,
            age=int(age),
            role=role
        )

        return JsonResponse({
            'message': 'User created successfully',
            'user_id': user.id,
            'email': user.email
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except ValueError as e: #meken wennne value error ekak handle krnna puluwan,ValueError kiynne error ekak thiyenne data tika invalid naththam raise krnna puluwan
        return JsonResponse({'error': f'Invalid data: {str(e)}'}, status=400)
    except Exception as e: #meken wennne general exception ekak handle krnna puluwan,Exception kiynne error ekak thiyenne unexpected naththam raise krnna puluwan
        return JsonResponse({'error': f'Failed to create user: {str(e)}'}, status=500)

@api_view(['GET'])
def get_users(request):
    """Get all users from Supabase"""
    try:
        users = User.objects.all().values('id', 'username', 'email', 'phone', 'age', 'role', 'created_at')
        return JsonResponse({'users': list(users)})
    except Exception as e:
        return JsonResponse({'error': f'Failed to get users: {str(e)}'}, status=500) 

@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return Response({'status': 'Server is running', 'message': 'Welcome to Medicare API with Supabase!'})