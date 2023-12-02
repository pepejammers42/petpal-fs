from .models import Notification
from rest_framework.serializers import ModelSerializer

"""
You should only be able change the state of a notification from "unread" to "read".
It is fine to not do the above, but instead make a notification read the first time it is retrieved.
"""

# Specifically relevant to Create
class NotificationSerializerC(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id','notification_type', 'message', 'creation_time', 'last_update_time', 'is_read', 'recipient', 'sender', 'content_type', 'object_id', 'link']
        read_only_fields = ['id','sender', 'content_type', 'object_id']

# Specifically relevant to Read, Update, Destroy (only is_read) modification
class NotificationSerializerRUD(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id','notification_type', 'message', 'creation_time', 'last_update_time', 'is_read', 'recipient', 'sender', 'content_type', 'object_id', 'link']
        read_only_fields = ['id','notification_type', 'message', 'creation_time', 'last_update_time', 'recipient', 'sender', 'content_type', 'object_id']