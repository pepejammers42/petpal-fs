from django.db import models
from django.utils import timezone
from pet_listings.models import PetListing
from accounts.models import Seeker

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('withdrawn', 'Withdrawn')
    ]

    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE)
    applicant = models.ForeignKey(Seeker, on_delete=models.CASCADE)
    status = models.CharField(choices=STATUS_CHOICES, default='pending', max_length=20)
    creation_time = models.DateTimeField(auto_now_add=True)
    last_update_time = models.DateTimeField(auto_now=True)
    personal_statement = models.TextField()

