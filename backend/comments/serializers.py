from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import Comment


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id','user','body','created_at','object_id','content_type']
        read_only_fields = ['user','created_at','object_id','content_type']

