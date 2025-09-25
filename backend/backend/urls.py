
from django.contrib import admin
from django.urls import path
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPirViews, TokenrefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/",CreateUserView.as_view(),name="register"),
    path("api/token",TokenObtainPirViews.as_view(),name="get_token"),
    path("api/token/refresh/",TokenObtainPirViews.as_view(),name="refresh"),
    path("api-auth/",include("rest_freamework.urls")),
]
