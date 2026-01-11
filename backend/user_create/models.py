from django.db import models # meken wennwema models walata access karanna puluwan,database eke table hadanna puluwan
from django.contrib.auth.models import AbstractUser

class User(models.Model): #menn mee namin table ekak hadan eka thama wenne
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=15)
    age = models.IntegerField()
    role = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): #menn meka wenne object ekak string akakata convert karanna
        return self.username #menn meka wenne username eka return karanna

    class Meta:
        db_table = 'users' #menn meka wenne database eke table ekata namak denna