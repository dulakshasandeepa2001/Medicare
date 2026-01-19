from django.apps import AppConfig


class TaskcreateConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'taskcreate'  # ← Changed from 'app_name'
    verbose_name = 'Task Management'