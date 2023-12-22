from rest_framework.serializers import ModelSerializer
from .models import Application
from pet_listings.models import PetListing
from django.utils import timezone
from django.shortcuts import get_object_or_404
from pet_listings.serializers import PetListingSerializer
from accounts.serializers import SeekerSerializer


class ApplicationSerializer(ModelSerializer):
    pet_listing = PetListingSerializer()
    applicant = SeekerSerializer()
    
    class Meta:
        model = Application
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.context.get('request', None) and self.context['request'].method == 'POST':
            for field_name in set(self.fields) - {'personal_statement'}:
                self.fields.pop(field_name)
        if self.context.get('request', None) and self.context['request'].method == 'PUT':
            for field_name in set(self.fields) - {'status'}:
                self.fields.pop(field_name)

    def create(self, validated_data):
        request = self.context.get('request')

        applicant = request.user.seeker
        pet_listing = get_object_or_404(PetListing, id=request.parser_context['kwargs']['pk'])

        application = Application.objects.create(applicant=applicant, pet_listing=pet_listing, **validated_data)

        return application
