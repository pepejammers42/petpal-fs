from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        user = None

        if self.model == Seeker:
            user = Seeker(email=self.normalize_email(email), **extra_fields)
        elif self.model == Shelter:
            user = Shelter(email=self.normalize_email(email), **extra_fields)
        else:
            user = Shelter(email=self.normalize_email(email), **extra_fields)
            # raise ValueError(f"Invalid account type.")
            
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        return self.create_user(email, password, **extra_fields)

class AuthUser(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

class Seeker(AuthUser):
    is_active = models.BooleanField(default=True)
    # last_login = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone_number = models.CharField(max_length=10, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    location = models.CharField(max_length=100, blank=True)
    preference = models.CharField(max_length=100, blank=True)


class Shelter(AuthUser):
    is_active = models.BooleanField(default=True)
    # last_login = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone_number = models.CharField(max_length=10, blank=True)
    shelter_name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    description = models.TextField(blank=True)

