from .models import PetListing
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

class PetListingSerializer(ModelSerializer):
    shelter = PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = PetListing
        # NOTE: I am unsure why a shelter would create a pet listing with status set to anything other than available, but we were not told not to.
        fields = '__all__'