from django.urls import path
from .views import PurchaseAPIView, UserPurchasesAPIView

urlpatterns = [
    path('purchases/', PurchaseAPIView.as_view(), name='purchase-list'),
    path('purchases/user/<str:userId>/', UserPurchasesAPIView.as_view(), name='user-purchases'),
]