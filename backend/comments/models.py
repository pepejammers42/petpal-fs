from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from accounts.models import AuthUser
# Create your models here.
class Comment(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    rating = models.IntegerField(choices=RATING_CHOICES, default=5)
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE) #'Shelter' or 'Application'
    object_id = models.PositiveIntegerField() #shelter_id or application_id
    content_object = GenericForeignKey('content_type','object_id')

class Reply(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE) #'Shelter' or 'Application'
    object_id = models.PositiveIntegerField() #shelter_id or application_id
    content_object = GenericForeignKey('content_type','object_id')
