from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, permissions, exceptions
from .models import Comment
from accounts.models import Shelter, AuthUser
from applications.models import Application
from django.contrib.contenttypes.models import ContentType
from .serializers import CommentSerializer, ReplySerializer
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework import status

# Create your views here.
COMMENT_PAGINATION_SIZE = 10 # Number of results to display per page (by default)
COMMENT_PAGINATION_SIZE_MAX = 20 # Maximum number of results to display per page
COMMENT_PAGINATION_SIZE_PARAM = 'page_size' # Query parameter to read page size from

class CommentPagination(PageNumberPagination):
    page_size = COMMENT_PAGINATION_SIZE  # Number of results to display per page (by default)
    max_page_size = COMMENT_PAGINATION_SIZE_MAX # Maximum number of results to display per page
    page_size_query_param = COMMENT_PAGINATION_SIZE_PARAM # Query parameter to read page size from
    
class ShelterCommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
            Create a comment to the shelter with shelter id = shelter_id. All logged in users can.
        """
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        shelter_id = self.kwargs['shelter_id']
        get_object_or_404(Shelter, pk=shelter_id) #check shelter exists
        content_type = ContentType.objects.get_for_model(Shelter)
        serializer.save(user=self.request.user, object_id=shelter_id, content_type=content_type)
                                            

class ShelterCommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CommentPagination
    
    def get(self, request, *args, **kwargs):
        """
            Get a list of all comments to shelter with shelter id = shelter_id. All logged in users can.
        """
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        shelter_id = self.kwargs['shelter_id']
        content_type = ContentType.objects.get_for_model(Shelter)
        return Comment.objects.filter(content_type=content_type, object_id=shelter_id).order_by('-created_at') #descending order


class ShelterReplyCreateView(generics.CreateAPIView):
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        shelter_id = self.kwargs['shelter_id']
        comment_id = self.kwargs['comment_id']
        
        # Ensure the shelter and comment exist
        get_object_or_404(Shelter, pk=shelter_id)
        comment = get_object_or_404(Comment, pk=comment_id)
        content_type = ContentType.objects.get_for_model(Shelter)
        serializer.save(user=self.request.user, comment=comment, content_type=content_type, object_id=shelter_id)
  

class ApplicationReplyCreateView(generics.CreateAPIView):
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        comment_id = self.kwargs['comment_id']
        application_id = self.kwargs['application_id']
        comment = get_object_or_404(Comment, pk=comment_id)
        application = get_object_or_404(Application, pk=application_id) 

        # Check if the user is related to the application (either seeker or shelter)
        if application.applicant.email != self.request.user.email and application.pet_listing.shelter.email != self.request.user.email:
            raise exceptions.PermissionDenied("You do not have permission to reply to this comment.")

        content_type = ContentType.objects.get_for_model(Application)
        serializer.save(user=self.request.user, comment=comment, content_type=content_type, object_id=application_id)
        application.save() #to save last update time
        
class ApplicationCommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
            Create a comment to the application with application id = application_id. Only related shelter and seeker to application can.
        """
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        application_id = self.kwargs['application_id']
        application = get_object_or_404(Application, pk=application_id)
        #only related seeker and shelter of that application can comment
        # has to .email otherwise although it prints the same, but still different object
        if application.applicant.email != self.request.user.email and application.pet_listing.shelter.email  != self.request.user.email:
            #print(application.applicant, self.request.user, application.pet_listing.shelter)
            raise exceptions.PermissionDenied("You do not have permission to comment on this application.")
        content_type = ContentType.objects.get_for_model(Application)
        serializer.save(user=self.request.user, object_id=application_id, content_type=content_type)
        application.save() #to save last update time
                                            

class ApplicationCommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CommentPagination
    
    def get(self, request, *args, **kwargs):
        """
            Get a list of all comments to the application with application id = application_id. Only related shelter and seeker to application can.
        """
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        application_id = self.kwargs['application_id']
        application = get_object_or_404(Application, pk=application_id)
        #only related seeker and shelter of that application can see comment
        # has to .email otherwise although it prints the same, but still different object
        if application.applicant.email != self.request.user.email and application.pet_listing.shelter.email  != self.request.user.email:
            raise exceptions.PermissionDenied("You do not have permission to see comments.")
        content_type = ContentType.objects.get_for_model(Application)
        return Comment.objects.filter(content_type=content_type, object_id=application_id).order_by('-created_at') #descending order
