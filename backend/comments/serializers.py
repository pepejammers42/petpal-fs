from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import Comment, Reply


class ReplySerializer(ModelSerializer):
    comment = PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Reply
        fields = ['comment','id','user','body','created_at','object_id','content_type']
        read_only_fields = ['comment','user','created_at','object_id','content_type']

class CommentSerializer(ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    class Meta:
        model = Comment
        fields = ['rating','replies','id','user','body','created_at','object_id','content_type']
        read_only_fields = ['user','created_at','object_id','content_type']

