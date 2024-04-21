from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import *
from Accounts.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated , IsAuthenticatedOrReadOnly
from rest_framework.pagination import PageNumberPagination
from POS_backend import settings

import random
from django.shortcuts import get_object_or_404

class CategoryView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
          category = request.query_params.get('name')
          store_code = request.query_params.get('store')

          if store_code and category:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users by store and name
              category = Category.objects.filter(store=store, category__icontains=category)
          elif store_code:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users only by store
              category = Category.objects.filter(store=store)
          else:
              # Handle the case where store_code is not provided
              category = Category.objects.none()
          serializer = CategorySerializer(category, many=True)
          return Response(serializer.data, status=status.HTTP_200_OK)

class SubCategoryView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
          subcategory = request.query_params.get('name')
          store_code = request.query_params.get('store')

          if store_code and subcategory:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users by store and name
              category = SubCategory.objects.filter(store=store, name__icontains=subcategory)
          elif store_code:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users only by store
              category = SubCategory.objects.filter(store=store)
          else:
              # Handle the case where store_code is not provided
              category = SubCategory.objects.none()
          serializer = SubCategorySerializer(category, many=True)
          return Response(serializer.data, status=status.HTTP_200_OK)

class BrandView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
          name = request.query_params.get('name')
          store_code = request.query_params.get('store')

          if store_code and name:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users by store and name
              category = Category.objects.filter(store=store, name__icontains=name)
          elif store_code:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users only by store
              category = Category.objects.filter(store=store)
          else:
              # Handle the case where store_code is not provided
              category = Category.objects.none()
          serializer = CategorySerializer(category, many=True)
          return Response(serializer.data, status=status.HTTP_200_OK)

class ProductsView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        store = request.data.get('store_id')

        try:
            store = Store.objects.get(store_code = store)
        except Store.DoesNotExist:
            return Response({'error':'Store does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProductsSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
           serializer.save(store_code = store)
           return Response({'msg':'Product Saved'}, status=status.HTTP_200_OK)
        else: 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
          product_name = request.query_params.get('product_name')
          store_code = request.query_params.get('store')

          if store_code and product_name:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users by store and name
              name = Products.objects.filter(store=store, product_name__icontains=product_name)
          elif store_code:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users only by store
              product = Products.objects.filter(store = store)
          else:
              # Handle the case where store_code is not provided
              product = Products.objects.none()
          serializer = ProductsSerializer(product, many=True)
          return Response(serializer.data, status=status.HTTP_200_OK)
    

