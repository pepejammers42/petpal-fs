from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from accounts.models import Seeker, Shelter
"""
TODO:
- Ensure fields that should be required are actually required.
"""

GENDER_CHOICES = [
    ('male', 'Male'),
    ('female', 'Female')
]

SIZE_CHOICES = [
    ('small', 'Small'),
    ('medium', 'Medium'),
    ('large', 'Large'),
]

STATUS_CHOICES = [
    ('available', 'Available'),
    ('pending', 'Pending'),
    ('adopted', 'Adopted'),
    ('withdrawn', 'Withdrawn'),
]

# Create your models here.
class PetListing(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    status = models.CharField(choices=STATUS_CHOICES, max_length=10)
    breed = models.CharField(max_length=20)
    age = models.PositiveIntegerField()
    size = models.CharField(choices=SIZE_CHOICES, max_length=10)
    color = models.CharField(max_length=20)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=10)
    
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True) # Gotta have a picture!

    # If a shelter is deleted, all its applications should be removed
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE)


    # Optional fields (use blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    behavior = models.TextField(blank=True, null=True)
    special_needs = models.TextField(blank=True, null=True)
