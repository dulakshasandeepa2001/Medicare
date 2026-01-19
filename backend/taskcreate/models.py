from django.db import models # meken wennwema models walata access karanna puluwan,database eke table hadanna puluwan
from django.contrib.auth.models import AbstractUser

class Task(models.Model):
    """Task model for doctor's schedule"""
    
    TASK_TYPE_CHOICES = [
        ('consultation', 'Consultation'),
        ('surgery', 'Surgery'),
        ('follow-up', 'Follow-up'),
        ('administrative', 'Administrative'),
        ('other', 'Other'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    task_id = models.AutoField(primary_key=True)
    doctor_id = models.CharField(max_length=50)  # ✅ This should create VARCHAR in database
    task_date = models.DateField()
    task_title = models.CharField(max_length=200)
    task_description = models.TextField(blank=True, null=True)
    task_type = models.CharField(max_length=50, choices=TASK_TYPE_CHOICES, default='other')
    start_time = models.TimeField()
    end_time = models.TimeField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.task_title} - {self.task_date}"
    
    class Meta:
        db_table = 'doctor_tasks'
        ordering = ['task_date', 'start_time']