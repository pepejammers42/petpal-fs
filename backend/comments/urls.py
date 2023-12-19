from django.urls import path
from .views import ShelterCommentCreateView,  ShelterCommentListView, ApplicationCommentCreateView, ApplicationCommentListView,ApplicationReplyCreateView, ShelterReplyCreateView

urlpatterns = [
    path('applications/<int:application_id>/', ApplicationCommentCreateView.as_view()),
    path('applications/<int:application_id>/replies/<int:comment_id>/',ApplicationReplyCreateView.as_view()),
    path('applications/<int:application_id>/all/', ApplicationCommentListView.as_view()),
    path('shelters/<int:shelter_id>/', ShelterCommentCreateView.as_view()),
    path('shelters/<int:shelter_id>/replies/<int:comment_id>/', ShelterReplyCreateView.as_view()),
    path('shelters/<int:shelter_id>/all/', ShelterCommentListView.as_view() ),
]
