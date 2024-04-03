from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Purchase, Course
from .serializers import PurchaseSerializer, CourseSerializer

# Create your views here.
class PurchaseAPIView(APIView):
    def get(self, request):
        purchases = Purchase.objects.all()
        serializer = PurchaseSerializer(purchases, many=True)
        return Response(serializer.data)


class UserPurchasesAPIView(APIView):
    def get(self, request, userId, format=None):
        try:
            purchases = Purchase.objects.filter(userId=userId).select_related('courseId')
            purchase_serializer = PurchaseSerializer(purchases, many=True)
            return Response(purchase_serializer.data)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)