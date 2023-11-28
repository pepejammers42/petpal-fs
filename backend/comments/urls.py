from django.urls import path
from .views import ShelterCommentCreateView,  ShelterCommentListView, ApplicationCommentCreateView, ApplicationCommentListView

urlpatterns = [
    path('applications/<int:application_id>/', ApplicationCommentCreateView.as_view()),
    path('applications/<int:application_id>/all/', ApplicationCommentListView.as_view()),
    path('shelters/<int:shelter_id>/', ShelterCommentCreateView.as_view()),
    path('shelters/<int:shelter_id>/all/', ShelterCommentListView.as_view() ),
]
