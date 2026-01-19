from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from taskcreate.models import Task
import json


@api_view(['POST'])
def create_task(request):
    """Create a new task"""
    try:
        data = json.loads(request.body)

        task_id = data.get("task_id")  # optional (AutoField will handle if None)
        doctor_id = data.get("doctor_id")
        task_date = data.get("task_date")
        task_title = data.get("task_title")
        task_description = data.get("task_description")
        task_type = data.get("task_type")
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        priority = data.get("priority")

        # Required field validation
        if not all([task_date, task_title, start_time, end_time]):
            return JsonResponse(
                {'error': 'All required fields must be provided'},
                status=400
            )

        task = Task.objects.create(
            doctor_id=doctor_id,
            task_date=task_date,
            task_title=task_title,
            task_description=task_description,
            task_type=task_type,
            start_time=start_time,
            end_time=end_time,
            priority=priority
        )

        return JsonResponse({
            'message': 'Task created successfully',
            'task_id': task.task_id
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    except ValueError as e:
        return JsonResponse({'error': f'Invalid data: {str(e)}'}, status=400)

    except Exception as e:
        return JsonResponse(
            {'error': f'Failed to create task: {str(e)}'},
            status=500
        )


api_view(['POST'])
def get_tasks(request):
    """Get all tasks for a specific doctor and date using POST method"""
    try:
        # Parse JSON body
        data = json.loads(request.body)
        
        doctor_id = data.get('doctor_id')
        task_date = data.get('task_date')

        print(f"🔍 Fetching tasks for Doctor ID: {doctor_id} on Date: {task_date}")

        # Validate required fields
        if not doctor_id:
            return JsonResponse({'error': 'Doctor ID is required'}, status=400)
        
        if not task_date:
            return JsonResponse({'error': 'Task date is required'}, status=400)

        # Query tasks from database
        tasks = Task.objects.filter(
            doctor_id=doctor_id,
            task_date=task_date
        ).values(
            'task_id',
            'doctor_id',
            'task_date',
            'task_title',
            'task_description',
            'task_type',
            'start_time',
            'end_time',
            'priority'
        ).order_by('start_time')

        print(f"✅ Found {len(tasks)} tasks")

        return JsonResponse({
            'success': True,
            'status': 'success',
            'tasks': list(tasks),
            'count': len(tasks)
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    except Exception as e:
        print(f"❌ Error fetching tasks: {str(e)}")
        return JsonResponse(
            {'error': f'Failed to fetch tasks: {str(e)}'},
            status=500
        )

@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return Response({'status': 'Server is running', 'message': 'Welcome to Medicare API with Supabase!'})


