# backend/urls.py
from django.urls import include, path #meken wenne url path eka hadnwa,ekiynne django eke url path hadanna use krnne
from user_create.views import create_user, get_users, get_doctor, login_user #meken wenne views file eke create_user function eka import krnne
from taskcreate.views import create_task, health_check, get_tasks , delete_task # Import the create_task and health_check views

#meken thama function walat call krnne,url ekat galapena function eka hoygnne methanin
#create_user url eka run unam methnat enwa awill ee function ekat ynwa


urlpatterns = [ 
    
    path("create-user/", create_user), #url path eka hadnne create-user/ kiyala,ekiynne me url eka call krnne create_user function eka
    path("get-users/", get_users), #url path eka hadnne get-users/ kiyala,ekiynne me url eka call krnne get_users function eka
   # path("health-check/", health_check), #url path eka hadnne health-check/ kiyala,ekiynne me url eka call krnne health_check function eka
    path("login/", login_user), #url path eka hadnne login/ kiyala,ekiynne me url eka call krnne login_user function eka
    path("get-doctor/", get_doctor), #url path eka hadnne get-doctor/ kiyala,ekiynne me url eka call krnne get_doctor function eka
    path("create-task/", create_task), #url path eka hadnne create-task/ kiyala,ekiynne me url eka call krnne create_task function eka
    path("health-check/", health_check), #url path eka hadnne health-check/ kiyala,ekiynne me url eka call krnne health_check function eka
    path("get-tasks/", get_tasks),  # URL path for getting tasks
    path("delete-task/<int:task_id>/", delete_task)  # URL path for deleting a task

]
