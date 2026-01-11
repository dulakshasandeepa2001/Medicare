"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .views import register_user


@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return Response({'status': 'Server is running', 'message': 'Welcome to Medicare API'})



urlpatterns = [
    path('', health_check),  # Root URL
    path('register/', register_user),
]

@api_view(['post'])
def register_user(request):
    data=request.data #get the data from frontend

    #1️⃣ Validate all requried fields exits
    
