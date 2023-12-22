from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination
from django.contrib.contenttypes.models import ContentType
from .models import Notification
from .serializers import NotificationSerializerC, NotificationSerializerRUD
from drf_yasg.utils import swagger_auto_schema

LISTING_PAGINATION_SIZE = 10 # Number of results to display per page (by default)
LISTING_PAGINATION_SIZE_MAX = 20 # Maximum number of results to display per page
LISTING_PAGINATION_SIZE_PARAM = 'page_size' # Query parameter to read page size from

class NotificationListPagination(PageNumberPagination):
    page_size = LISTING_PAGINATION_SIZE  # Number of results to display per page (by default)
    max_page_size = LISTING_PAGINATION_SIZE_MAX # Maximum number of results to display per page
    page_size_query_param = LISTING_PAGINATION_SIZE_PARAM # Query parameter to read page size from

class NotificationListCreate(ListCreateAPIView):
    serializer_class = NotificationSerializerC
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationListPagination

    def get(self, request, *args, **kwargs):
        """
            Get a list of all notifications for that user.
        """
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
            Create a notification to a user with a message.
        """
        return super().post(request, *args, **kwargs)

    def get_queryset(self):
        queryset = Notification.objects.all()

        queryset = queryset.order_by('-creation_time') # Sort notifications by creation time (2 mark)
        queryset = queryset.filter(recipient=self.request.user) # Users (shelter and seeker) can only view their own notifications (1 mark)

        is_read = self.request.query_params.get('is_read', False) # Default filter to show unread notifications
        if is_read:
            queryset = queryset.filter(is_read=is_read) # Filter notifications by read/unread (2 mark)            

        return queryset
    
    def perform_create(self, serializer):    
        recipient = serializer.validated_data.get('recipient', None)

        if recipient:   
            content_type = ContentType.objects.get_for_model(recipient) # Get the type of the selected recipient
            object_id = recipient.id # Get the id of the current user
            serializer.save(sender=self.request.user, content_type=content_type, object_id=object_id)

class NotificationRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = NotificationSerializerRUD
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationListPagination

    
    def get(self, request, *args, **kwargs):
        """
            Retreive a specific notification. 
        """
        return super().get(request, *args, **kwargs)
    @swagger_auto_schema(auto_schema=None)
    def patch(self):
        return
    
    def put(self, request, *args, **kwargs):
        """
            Update a notification to be read.
        """
        return super().put(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        """
            Delete a notification.
        """
        return super().delete(request, *args, **kwargs)

    def get_object(self):
        # Users (shelter and seeker) can only view their own notifications (1 mark)
        return get_object_or_404(Notification, id=self.kwargs['pk'], recipient=self.request.user)
