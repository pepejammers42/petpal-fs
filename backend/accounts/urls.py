from django.urls import path
from . import views

urlpatterns=[
    path('shelter/', views.ShelterListCreateAPIView.as_view(), name='shelter_list_create'),
    path('seeker/', views.SeekerCreateAPIView.as_view(), name='seeker_list_create'),
    path('shelter/<int:pk>/', views.ShelterRetrieveUpdateDestroyAPIView.as_view()),
    path('seeker/<int:pk>/', views.SeekerRetrieveUpdateDestroyAPIView.as_view()),
]
