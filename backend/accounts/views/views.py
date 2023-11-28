from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.exceptions import PermissionDenied
from drf_yasg.utils import swagger_auto_schema
from applications.models import Application
from rest_framework.exceptions import ValidationError

from ..models import Shelter, Seeker
from ..serializers import ShelterSerializer, SeekerSerializer

class ShelterListCreateAPIView(ListCreateAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """
            Get a list of all shelters available.
        """
        return super().get(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        """
            Create a brand new shelter with the proper payloads.
        """
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()

class SeekerCreateAPIView(CreateAPIView):
    serializer_class = SeekerSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
            Create a brand new seeker with the proper payloads.
        """
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()

class SeekerRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Seeker.objects.all()
    serializer_class = SeekerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        seeker = get_object_or_404(Seeker, pk=self.kwargs['pk'])
        
        try: 
            if self.request.user.shelter:
                check_app = Application.objects.filter(applicant=seeker, pet_listing__shelter=self.request.user).exists()

                if check_app:
                    return seeker
                else:
                    raise ValidationError({'detail': 'You cannot view this seeker since it does not have any active applications with you.'})
        except Shelter.DoesNotExist:
            try:
                if self.request.user.seeker:
                    return seeker
            except Seeker.DoesNotExist:
                raise ValidationError({'detail': 'User must be a Seeker or Shelter related to this application to access this resource.'})

        return seeker

    def get(self, request, *args, **kwargs):
        """
            Get a specific seeker's profile.
        """
        return super().get(request, *args, **kwargs)
    def put(self, request, *args, **kwargs):
        """
            Update a specific seeker's profile.
        """
        return super().put(request, *args, **kwargs)
    def delete(self, request, *args, **kwargs):
        """
            Delete a specific seeker's profile.
        """
        return super().delete(request, *args, **kwargs)
    @swagger_auto_schema(auto_schema=None)
    def patch(self):
        return
        

class ShelterRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer

    def get_object(self):
        return get_object_or_404(Shelter, pk=self.kwargs['pk'])

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, *args, **kwargs):
        """
            Get a specific shelter's profile.
        """
        return super().get(request, *args, **kwargs)
    def put(self, request, *args, **kwargs):
        """
            Update a specific shelter's profile.
        """
        return super().put(request, *args, **kwargs)
    def delete(self, request, *args, **kwargs):
        """
            Delete a specific shelter's profile.
        """
        return super().delete(request, *args, **kwargs)
    @swagger_auto_schema(auto_schema=None)
    def patch(self):
        return
