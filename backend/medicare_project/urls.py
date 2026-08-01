"""
URL configuration for medicare_project project.
"""
from django.contrib import admin
from django.urls import path
from accounts.views import (
    create_user, get_users, get_doctor, login_user,
    get_pending_doctors, approve_doctor, reject_doctor,
)
from taskcreate.views import create_task, health_check, get_tasks, delete_task

urlpatterns = [
    path('admin/', admin.site.urls),
    path("create-user/", create_user),
    path("get-users/", get_users),
    path("login/", login_user),
    path("get-doctor/", get_doctor),
    path("create-task/", create_task),
    path("health-check/", health_check),
    path("get-tasks/", get_tasks),
    path("delete-task/<int:task_id>/", delete_task),
    path("pending-doctors/", get_pending_doctors),
    path("approve-doctor/<int:pk>/", approve_doctor),
    path("reject-doctor/<int:pk>/", reject_doctor),
]

