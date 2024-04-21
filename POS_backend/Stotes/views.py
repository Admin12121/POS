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
# Create your views here.
class CustomersView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
           name = request.query_params.get('name')
           store_code = request.query_params.get('store')

           if store_code and name:
               # Get the store object by store code
               store = get_object_or_404(Store, store_code=store_code)
               users = Customers.objects.filter(store=store, name__icontains=name)
           elif store_code:
               # Get the store object by store code
               store = get_object_or_404(Store, store_code=store_code)
               # Filter users only by store
               users = Customers.objects.filter(store=store)
           else:
               # Handle the case where store_code is not provided
               users = Customers.objects.none()
           serializer = CustomersDataSerializer(users, many=True)
           return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterCustomersView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
         serializer = RegisterCustomerSerializer(data= request.data)
         serializer.is_valid(raise_exception=True)
         serializer.save()
         return Response({'msg':'Customer Registred'}, status=status.HTTP_201_CREATED)

class DepartmentDataView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
            name = request.query_params.get('name')
            store_code = request.query_params.get('store')

            if store_code:
                store = get_object_or_404(Store, store_code=store_code)
                dep = Department.objects.filter(store = store)
            serializer = DepartmentDataSerializer(dep, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterStoreView(APIView):
     renderer_classes = [UserRenderer]

     def post(self, request, format=None):
        serializer = StoreRegistrationSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'msg':'Store Registred'}, status=status.HTTP_201_CREATED)
