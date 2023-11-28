
from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField, EmailField, CharField
from .models import Shelter, Seeker
from rest_framework import serializers

class ShelterSerializer(ModelSerializer):
    confirm_password = CharField(write_only=True)

    class Meta:
        model = Shelter
        fields = ['id', 'email', 'password', 'confirm_password', 'shelter_name', 'avatar', 'phone_number', 'address', 'description']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"Error": "Passwords must match."})
        return data

    def create(self, validated_data):
        # hash the password
        validated_data.pop('confirm_password')
        password = validated_data.pop('password', None)
        shelter = Shelter(**validated_data)
        if password:
            shelter.set_password(password)
        shelter.save()
        return shelter

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class SeekerSerializer(ModelSerializer):
    confirm_password = CharField(write_only=True)

    class Meta:
        model = Seeker
        fields = ['id','email', 'password', 'confirm_password', 'first_name', 'last_name', 'avatar', 'phone_number', 'location', 'preference']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"Error": "Passwords must match."})
        return data

    def create(self, validated_data):
        # hash the password
        validated_data.pop('confirm_password')
        password = validated_data.pop('password', None)
        seeker = Seeker(**validated_data)
        if password:
            seeker.set_password(password)
        seeker.save()
        return seeker

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
