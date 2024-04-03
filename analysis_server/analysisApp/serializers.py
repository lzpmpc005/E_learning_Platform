from rest_framework import serializers
from .models import Purchase, Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    course = CourseSerializer(source='courseId', read_only=True)

    class Meta:
        model = Purchase
        fields = ['id', 'userId', 'courseId', 'createdAt', 'updatedAt', 'course']
