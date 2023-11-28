from django.db import models
from applications.models import Application
from accounts.models import Seeker, Shelter, AuthUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

"""
Users should receive notifications for messages, status updates, and new pet listings (based on their preference).
Shelters should receive notification for new reviews, new applications, and new messages from applicants.
"""
class Notification(models.Model):
    """
        ('message', 'Message'),
        ('pet_listing', 'Pet Listing'),
        ('application', 'Application'),
        ('pet', 'Pet'),
        ('shelter', 'Shelter'),
        ('seeker', 'Seeker'),
        ('user', 'User'),
    """

    NOTIFICATION_TYPES = [
        ('message', 'Message'),
        ('status_update','Status Update'),
        ('pet_listing', 'Pet Listing'),
        ('application', 'Application'),
        ('review','Review'),
    ]

    notification_type = models.CharField(choices=NOTIFICATION_TYPES, max_length=20) # We need to do this because you shouldn't be creating a unrecognized notification type

    message = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_update_time = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    recipient = models.ForeignKey('accounts.AuthUser', on_delete=models.CASCADE)
    sender = models.ForeignKey('accounts.AuthUser', on_delete=models.CASCADE, related_name='sender', null=True, blank=True)

    # Should provide a link to the associated model (use contenttypes)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE) # The assosciated model
    object_id = models.PositiveIntegerField() # ID of the assosciated model
    content_object = GenericForeignKey('content_type','object_id')

    def __str__(self):
        return self.message
