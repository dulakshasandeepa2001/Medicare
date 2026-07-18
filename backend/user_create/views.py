from rest_framework.decorators import api_view #meken wennne api view ekak hadanna puluwan,api view kiynne django rest framework eke view ekak hadanna use karana decorator ekak
from rest_framework.response import Response #meken wennne api view ekak return karanna puluwan response ekak
from django.http import JsonResponse #meken wennne json response ekak return karanna puluwan
import json #meken wennne json data ekak handle karanna puluwan, handle krnwa kiynne json data ekak load krnna, dump krnna wage kriyawalata
from user_create.models import PendingDoctor, User #meken wennne User model ekata access karanna puluwan
from django.core.exceptions import ValidationError #meken wennne validation error ekak handle karanna puluwan,validation error thiyenne data tika valid naththam raise krnna puluwan error ekak
from django.contrib.auth.hashers import make_password #meken wennne password ekak hash karanna puluwan
from user_create.models import Doctor #user crete app eke model wala kiyna eka thiyenene
from django.contrib.auth.hashers import check_password #meken karnne password ekath hash karnn gannwa


@api_view(['POST'])
def create_user(request):
    data = json.loads(request.body)
    role = data.get("role")
    
    # ... validation ...
    
    if role == "patient":
        # ── PATH A: Patient → directly to users table ──
        user = User.objects.create(
            username=data.get('username'),
            email=data.get('email'),
            password=make_password(data.get('password')),
            NIC_number=data.get('NIC_number'),
            phone=data.get("phone"),
            birthday=data.get("birthday"),
            role=data.get("role"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at")
        )
        return JsonResponse({'message': 'Account created! You can login now.'})
    
    elif role == "doctor":
        # ── PATH B: Doctor → goes to pending_doctors table ──
        # Also check if this doctorID exists in register_DoctorID
        pending = PendingDoctor.objects.create(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password'),
            phone=data.get('phone'),
            NIC_number=data.get('NIC_number'),
            birthday=data.get('birthday'),
            doctorID=data.get('doctorID')  ,
            university=data.get('university'),
            degrees=data.get('degrees'),
            Working_hospital=data.get('working_hospital'),
            status='pending'  # ← waiting for admin
            
        )
        return JsonResponse({
            'message': 'Registration submitted! Waiting for admin approval.',
            'pending_id': pending.id
        })
@api_view(['GET'])
def get_doctor(request):
    """Get all doctors from Supabase"""
    try:
        doctor = Doctor.objects.all().values('doctor_id', 'register_id', 'doctor_nicnumber', 'doctors_name', 'dob','degrees', 'university', 'working_hospital')
        return JsonResponse({'doctors': list(doctor)})
    except Exception as e:
        return JsonResponse({'error': f'Failed to get doctors: {str(e)}'}, status=500)
@api_view(['GET'])
def get_users(request):
    """Get all users from Supabase"""
    try:
        users = User.objects.all().values('doctorID', 'username','password', 'email', 'phone', 'birthday', 'role', 'created_at', 'NIC_number')
        return JsonResponse({'users': list(users)})
    except Exception as e:
        return JsonResponse({'error': f'Failed to get users: {str(e)}'}, status=500) 

@api_view(['POST'])
def login_user(request):
    try:
        data = json.loads(request.body) # json file eke data tika gannwa 
        username = data.get("username")
        password = data.get("password")

        if not username or not password: #data base eke mee  user name eka or password eka naththam
            return JsonResponse({"error": "Username and password are required"}, status=400) #return krnna json response ekak,error kiynne username and password are required,status 400 kiynne bad request ekak

        try:
            user = User.objects.get(username=username) #data base eke user name eka gannwa,methandi models.py eke thama connect wela innne,model eka hara users table eke data read karala thiyenne
        except User.DoesNotExist: #if block ekak start krnna,if user does not exist kiynne user eka naththam raise krnna puluwan error ekak
            return JsonResponse({"error": "Invalid username or password"}, status=401) #return krnna json response ekak,error kiynne invalid username or password,status 401 kiynne unauthorized ekak

        
        if not check_password(password, user.password): #if block ekak start krnna,if password eka invalid naththam raise krnna puluwan error ekak,check_password kiynne password eka verify krnna use krnna method ekak,meka hash password eken apu password ekath e algorythem ekennm hash karwa 
            return JsonResponse({"error": "Invalid username or password"}, status=401)

        return JsonResponse(
            {
                "message": "Login successful", 
                "username": user.username,
                "role": user.role,
                "doctorID": user.doctorID
            }, #dekam hari giyam meka return karnwwa 
            status=200
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": f"Failed to login: {str(e)}"}, status=500)

@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return Response({'status': 'Server is running', 'message': 'Welcome to Medicare API with Supabase!'})

@api_view(['GET'])
def get_pending_doctors(request):
    """Get all pending doctors from Supabase"""
    pending_doctors = PendingDoctor.objects.filter(status='pending').values(
        'id', 'username', 'email', 'phone', 'NIC_number', 'birthday', 'university', 'degrees', 'working_hospital'
    )
    return JsonResponse({'pending_doctors': list(pending_doctors)})
@api_view(['POST'])
def approve_doctor(request,pk):
    "Admin approves a pending doctor and moves them to the main User table"
    try:
        pending_doctor = PendingDoctor.objects.get(id=pk, status='pending')
        user = User.objects.create(
            username=pending_doctor.username,
            email=pending_doctor.email,
            password=pending_doctor.password,  # Already hashed
            phone=pending_doctor.phone,
            NIC_number=pending_doctor.NIC_number,
            birthday=pending_doctor.birthday,
            role='doctor',
            doctorID=pending_doctor.doctorID
        )
        pending_doctor.status = 'approved'
        pending_doctor.save()
        return JsonResponse({'message': f'Doctor {user.username} approved and moved to users table.'})
    except PendingDoctor.DoesNotExist:
        return JsonResponse({'error': 'Pending doctor not found or already processed.'}, status=404)
    
@api_view(['POST'])
def reject_doctor(request, pk):
        """Admin rejects a pending doctor"""
        try:
            pending_doctor = PendingDoctor.objects.get(id=pk, status='pending')
            pending_doctor.status = 'rejected'
            pending_doctor.save()
            return JsonResponse({'message': f'Doctor {pending_doctor.username} rejected.'})
        except PendingDoctor.DoesNotExist:
            return JsonResponse({'error': 'Pending doctor not found or already processed.'}, status=404)    
            