from django.urls import path
from .views import ApplicationCreate, ApplicationRetrieveUpdate, ShelterApplicationList

urlpatterns = [
    path('pets/<int:pk>/', ApplicationCreate.as_view()),
    path('<int:pk>/', ApplicationRetrieveUpdate.as_view()),
    path('', ShelterApplicationList.as_view()),
]

