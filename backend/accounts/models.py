from django.contrib.auth.models import AbstractUser
from django.db import models

# make the custom user model

class User(AbstractUser):  # already on default user model to add extra data fields
#meka call wenne serializer eke
    ROLE_CHOICES = (
        ('DOCTOR', 'Doctor'),
        ('PATIENT', 'Patient'),
        ('PHARMACIST', 'Pharmacist'),
    )

    email = models.EmailField(unique=True)  # email must be unique, used for login

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,  # can only be one of Doctor, Patient, Pharmacist
    )

    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
    )

    is_approved = models.BooleanField(
        default=False  # when user creates account, is_approved=False by default
        # admin must approve → set to True → then user can login
    )

    USERNAME_FIELD = 'email'  # login with email instead of username

    REQUIRED_FIELDS = ['username']  # required when creating user account

    def __str__(self):
        return self.email  # returns email when printing the user object
