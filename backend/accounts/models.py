from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    """
    ROLE_CHOICES = (
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )

    phone = models.CharField(max_length=15, blank=True, null=True)
    NIC_number = models.CharField(max_length=12, unique=True, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True, null=True)
    degrees = models.CharField(max_length=100, blank=True, null=True)
    university = models.CharField(max_length=100, blank=True, null=True)
    working_hospital = models.CharField(max_length=150, blank=True, null=True)
    doctorID = models.CharField(max_length=50, blank=True, null=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Doctor(models.Model):
    doctor_id = models.CharField(max_length=50, unique=True)
    register_id = models.CharField(max_length=100, unique=True)
    doctor_nicnumber = models.CharField(max_length=20, unique=True)
    doctors_name = models.CharField(max_length=150)
    dob = models.DateField()
    degrees = models.CharField(max_length=100)
    university = models.CharField(max_length=100)
    working_hospital = models.CharField(max_length=150)

    def __str__(self):
        return self.doctors_name

    class Meta:
        db_table = 'register_DoctorID'


class PendingDoctor(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=15)
    NIC_number = models.CharField(max_length=12, unique=True)
    birthday = models.DateField()
    degrees = models.CharField(max_length=100, blank=True, null=True)
    university = models.CharField(max_length=100, blank=True, null=True)
    working_hospital = models.CharField(max_length=150, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} - {self.status}"

    class Meta:
        db_table = 'pending_doctors'

