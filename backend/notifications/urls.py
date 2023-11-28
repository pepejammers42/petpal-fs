from django.urls import path
from .views import NotificationListCreate, NotificationRetrieveUpdateDestroy

urlpatterns = [
    path('', NotificationListCreate.as_view(), name='notifications-list-create'),
    path('<int:pk>/', NotificationRetrieveUpdateDestroy.as_view(), name='notifications-retrieve-update-destroy'),
]