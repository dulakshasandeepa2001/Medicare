from taskcreate.views import create_task, get_tasks, health_check, get_tasks  # Import the create_task and health_check views
from django.urls import path



urlpatterns = [
    path("create-task/", create_task),  # URL path for creating a task
    path("health-check/", health_check),  # URL path for health check
    path("get-tasks/", get_tasks),  # URL path for testing task creation

]
