from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import *
from django.contrib.auth import authenticate
from Accounts.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated , IsAuthenticatedOrReadOnly
from rest_framework.pagination import PageNumberPagination
from POS_backend import settings
import random
from django.shortcuts import get_object_or_404

class SalesDataView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
           name = request.query_params.get('name')
           store_code = request.query_params.get('store')

           if store_code and name:
                 store = get_object_or_404(Sales, store = store)
                 sales = Sales.objects.filter(store = store)
           else:
                 sales = Sales.objects.none()
           serializer = SalesDataSerializer(sales, many=True)
           return Response(serializer.data, status=status.HTTP_200_OK)
                 

class SalesReturnView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
           name = request.query_params.get('name')
           store_code = request.query_params.get('store')

           if store_code and name:
                 store = get_object_or_404(Sales, store = store)
                 sales = SalesReturn.objects.filter(store = store)
           else:
                 sales = SalesReturn.objects.none()
           serializer = SalesReturnSerializer(sales, many=True)
           return Response(serializer.data, status=status.HTTP_200_OK)
                 

