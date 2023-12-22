from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListAPIView, ListCreateAPIView
# Create your views here.
from .models import Application
from pet_listings.models import PetListing
from accounts.models import Seeker, Shelter
from .serializers import ApplicationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from rest_framework.pagination import PageNumberPagination

LISTING_PAGINATION_SIZE = 6 # Number of results to display per page (by default)
LISTING_PAGINATION_SIZE_MAX = 9 # Maximum number of results to display per page
LISTING_PAGINATION_SIZE_PARAM = 'page_size' # Query parameter to read page size from

class ApplicationListPagination(PageNumberPagination):
    page_size = LISTING_PAGINATION_SIZE  # Number of results to display per page (by default)
    max_page_size = LISTING_PAGINATION_SIZE_MAX # Maximum number of results to display per page
    page_size_query_param = LISTING_PAGINATION_SIZE_PARAM # Query parameter to read page size from

class ApplicationCreate(ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ApplicationListPagination

    def get(self, request, *args, **kwargs):
        """
            Get a list of applications for the logged in Seeker.
        """
        try:
            _ = self.request.user.seeker
        except Seeker.DoesNotExist:
            raise ValidationError({'detail': 'User must be a Seeker to create an application.'})
        
        return super().get(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        """
            Create a brand new application with the logged in Seeker to the pet.
        """
        try:
            _ = self.request.user.seeker
        except Seeker.DoesNotExist:
            raise ValidationError({'detail': 'User must be a Seeker to create an application.'})
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        pet = get_object_or_404(PetListing, id=self.kwargs['pk'])

        existing_application = Application.objects.filter(applicant=self.request.user, pet_listing=pet).exists()
        if existing_application:
            raise ValidationError({'detail': 'You already have an application for this pet.'})

        if pet.status != 'available':
            raise ValidationError({'detail': 'Pet is not available for application.'})

        try:
            _ = self.request.user.seeker
        except Seeker.DoesNotExist:
            raise ValidationError({'detail': 'User must be a Seeker to create an application.'})

        serializer.save()

    def list(self, request, *args, **kwargs):
        # Check if the user is a Seeker, otherwise deny access
        try:
            _ = self.request.user.seeker
        except Seeker.DoesNotExist:
            raise ValidationError({'detail': 'User must be a Seeker to create an application.'})

        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        # Filter applications based on the current user
        user = self.request.user

        try:
            if self.request.user.seeker:
                return Application.objects.filter(applicant=user)
        except Seeker.DoesNotExist:
            raise ValidationError({'detail': "User must be a Seeker to create an application."})


class ApplicationRetrieveUpdate(RetrieveUpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ApplicationListPagination
    

    @swagger_auto_schema(auto_schema=None)
    def patch(self):
        return
    def put(self, request, *args, **kwargs):
        """
            Update an application, available to the Shelter and Seeker.
        """
        return super().put(request, *args, **kwargs)
    def get(self, request, *args, **kwargs):
        """
            Get an application for the logged in Shelter and Seeker.
        """
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user

        try: 
            if self.request.user.seeker:
                return Application.objects.filter(applicant=user.seeker)
        except Seeker.DoesNotExist:
            try:
                if self.request.user.shelter:
                    return Application.objects.filter(pet_listing__shelter=user.shelter)
            except Shelter.DoesNotExist:
                raise ValidationError({'detail': 'User must be a Seeker or Shelter related to this application to access this resource.'})

    def perform_update(self, serializer):
        application = serializer.instance

        try: 
            if self.request.user.shelter:
                possible_changes = ['accepted', 'denied']
                cur_status = application.status
                new_status = serializer.validated_data.get('status', None)
                if cur_status != 'pending' or (new_status not in possible_changes):
                    raise ValidationError({'detail': 'Shelter can only update the status of an application from pending to accepted or denied.'})
        except Shelter.DoesNotExist:
            try:
                possible_changes = ['withdrawn']
                cur_status = application.status
                new_status = serializer.validated_data.get('status', None)
                if (cur_status not in ['pending', 'accepted']) or (new_status not in possible_changes):
                    raise ValidationError({'detail': 'Pet seeker can only update the status of an appilcation from pending or accepted to withdrawn.'})
            except Seeker.DoesNotExist:
                raise ValidationError({'detail': 'User must be a Seeker or Shelter to update an application.'})

        serializer.validated_data['last_update_time'] = timezone.now()
        serializer.save()  

class ShelterApplicationList(ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ApplicationListPagination

    def get(self, request, *args, **kwargs):
        """
            Get a list of applications for the logged in Shelter.
        """
        return super().get(request, *args, **kwargs)

    def get_queryset(self):

        queryset = {}

        try:
            shelter_user = self.request.user.shelter
            queryset = Application.objects.filter(pet_listing__shelter=shelter_user)
        except Shelter.DoesNotExist:
            try:
                seeker_user = self.request.user.seeker
                queryset = Application.objects.filter(applicant=seeker_user)
            except Seeker.DoesNotExist:
                raise ValidationError({'detail': 'Unauthorized user.'})
            #raise ValidationError({'detail': 'User must be a Shelter to see applications.'})

        #queryset = Application.objects.filter(pet_listing__shelter=self.request.user.shelter)

        status = self.request.query_params.get('status')
        if status is not None and status != '':
            queryset = queryset.filter(status=status)

        sort_by = self.request.query_params.get('sort_by')
        if sort_by is not None and sort_by != '':
            if sort_by == 'creation_time':
                queryset = queryset.order_by('creation_time')
            elif sort_by == 'last_update_time':
                queryset = queryset.order_by('last_update_time')

        return queryset
        


