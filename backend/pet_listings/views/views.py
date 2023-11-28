from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError
from accounts.models import Shelter
from drf_yasg.utils import swagger_auto_schema

from ..models import PetListing
from ..serializers import PetListingSerializer


LISTING_PAGINATION_SIZE = 10 # Number of results to display per page (by default)
LISTING_PAGINATION_SIZE_MAX = 20 # Maximum number of results to display per page
LISTING_PAGINATION_SIZE_PARAM = 'page_size' # Query parameter to read page size from

class PetListingListPagination(PageNumberPagination):
    page_size = LISTING_PAGINATION_SIZE  # Number of results to display per page (by default)
    max_page_size = LISTING_PAGINATION_SIZE_MAX # Maximum number of results to display per page
    page_size_query_param = LISTING_PAGINATION_SIZE_PARAM # Query parameter to read page size from

class PetListingListCreate(ListCreateAPIView):
    serializer_class = PetListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PetListingListPagination

    def get(self, request, *args, **kwargs):
        """
            Get a list of all pet listings available.
        """
        return super().get(request, *args, **kwargs)
    def post(self, request, *args, **kwargs):
        """
            Create a pet listing with the required payloads.
        """
        return super().post(request, *args, **kwargs)

    def get_queryset(self): # Called when querying for pet listings
        queryset = PetListing.objects.all()

        # Retrieve filter parameters
        shelter = self.request.query_params.get('shelter', None)
        status = self.request.query_params.get('status', "available") # Default status filter should be "available".
        breed = self.request.query_params.get('breed', None)
        age = self.request.query_params.get('age', None)
        size = self.request.query_params.get('size', None)
        color = self.request.query_params.get('color', None)
        gender = self.request.query_params.get('gender', None)
        sort_by = self.request.query_params.get('sort_by', None)

        # Apply sorting based on parameters
        if shelter:
            queryset = queryset.filter(shelter__shelter_name=shelter)

        if status:
            queryset = queryset.filter(status=status)

        if breed:
            queryset = queryset.filter(breed=breed)

        if age:
            queryset = queryset.filter(age=age)

        if size:
            queryset = queryset.filter(size=size)

        if color:
            queryset = queryset.filter(color=color)

        if gender:
            queryset = queryset.filter(gender=gender)

        if sort_by:
            queryset = queryset.order_by(sort_by)

        return queryset
    
    def perform_create(self, serializer): # Called after a pet listing is created
        # Ensure this user is a shelter (sekeers can't make pet listings)
        try:
            _ = self.request.user.shelter
        except Shelter.DoesNotExist:
            raise ValidationError({'detail': 'User must be a Shelter to create a Pet Listing.'})
        
        # self is the shelter
        # status should be available at the time of creation
        serializer.save(shelter=self.request.user.shelter)

class PetListingRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = PetListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PetListingListPagination

    @swagger_auto_schema(auto_schema=None)
    def patch(self):
        return
    
    def get(self, request, *args, **kwargs):
        """
            Get a specific pet listing belong to that shelter.
        """
        return super().get(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        """
            Update a pet listing belong to that shelter.
        """
        return super().put(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        """
            Delete a pet listing belong to that shelter.
        """
        return super().delete(request, *args, **kwargs)

    def get_object(self):
        # Ensure this user is a shelter (sekeers can't make pet listings)
        # NOTE: Yes, only the shelter can see the pet listing RUD (other shelters or seekers can't, but they can access it from the Create view above)
        try:
            _ = self.request.user.shelter
        except Shelter.DoesNotExist:
            raise ValidationError({'detail': 'User must be a Shelter to update a Pet Listing.'})

        # Search for the pet listing with this id and owned by the current shelter
        return get_object_or_404(PetListing, id=self.kwargs['pk'], shelter=self.request.user.shelter)
