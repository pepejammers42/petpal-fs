from django.urls import path
from .views import PetListingListCreate, PetListingRetrieveUpdateDestroy

urlpatterns = [
    path('', PetListingListCreate.as_view(), name='pet-listing-list-create'),
    path('<int:pk>/', PetListingRetrieveUpdateDestroy.as_view(), name='pet-listing-retrieve-update-destroy'),
]