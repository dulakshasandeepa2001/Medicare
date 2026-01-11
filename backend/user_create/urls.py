# backend/urls.py
from django.urls import path #meken wenne url path eka hadnwa,ekiynne django eke url path hadanna use krnne
from .views import create_user, get_users, health_check #meken wenne views file eke create_user function eka import krnne

#meken thama function walat call krnne,url ekat galapena function eka hoygnne methanin
#create_user url eka run unam methnat enwa awill ee function ekat ynwa


urlpatterns = [ #url path hadanna use krnne
    
    path("create-user/", create_user), #url path eka hadnne create-user/ kiyala,ekiynne me url eka call krnne create_user function eka
    path("get-users/", get_users), #url path eka hadnne get-users/ kiyala,ekiynne me url eka call krnne get_users function eka
    path("health-check/", health_check), #url path eka hadnne health-check/ kiyala,ekiynne me url eka call krnne health_check function eka

]
