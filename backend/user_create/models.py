from django.db import models # meken wennwema models walata access karanna puluwan,database eke table hadanna puluwan
from django.contrib.auth.models import AbstractUser

class User(models.Model): #menn mee namin table ekak hadan eka thama wenne
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=15)
    NIC_number = models.CharField(max_length=12, unique=True, blank=True, null=True)
    birthday = models.DateField()
    role = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    doctorID = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self): #menn meka wenne object ekak string akakata convert karanna
        return self.username #menn meka wenne username eka return karanna

    class Meta:
        db_table = 'users' #menn meka wenne database eke table ekata namak denna
        
class Doctor(models.Model):
    doctor_id = models.CharField(max_length=50, unique=True)
    register_id = models.CharField(max_length=100, unique=True)
    doctor_nicnumber = models.CharField(max_length=20, unique=True)
    doctors_name = models.CharField(max_length=150)
    dob=models.DateField()
    degrees = models.CharField(max_length=100)
    university = models.CharField(max_length=100)
    working_hospital = models.CharField(max_length=150)
    def __str__(self):
        return self.doctor_name

    class Meta:
        db_table = 'register_DoctorID'






