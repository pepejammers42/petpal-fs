from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from accounts.models import Shelter, Seeker
from rest_framework.exceptions import ValidationError


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["userID"] = user.id
        try:
            if hasattr(user, "shelter"):
                data["user"] = "shelter"
            elif hasattr(user, "seeker"):
                data["user"] = "seeker"
        except (Shelter.DoesNotExist, Seeker.DoesNotExist):
            raise ValidationError(
                {
                    "detail": "User must be a Seeker or Shelter related to this application to access this resource."
                }
            )
        return data
