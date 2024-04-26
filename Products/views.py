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

    def post(self, request, format=None):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        store_code = request.data.get('stor_code')
        store = get_object_or_404(Store, store_code=store_code)

        user = self.request.user
        serializer.validated_data['store'] = store
        serializer.validated_data['createdby'] = user

        serializer.save()
        return Response({'msg': 'Category added'}, status=status.HTTP_201_CREATED)
   
    def patch(self,request,*args,**kwargs):
      id = request.query_params.get('id')
      if id:
        try:
          category = Category.objects.get(id=id)
          category_name = category.category
          serializer = CategorySerializer(category,data=request.data, partial= True)
          if serializer.is_valid():
             serializer.save()
             return Response({'msg': f'Category {category_name} updated'}, status=status.HTTP_200_OK)
          return Response({'msg': 'invalid data'}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'msg': 'invalid id'}, status=status.HTTP_403_FORBIDDEN)
    
    def delete(self, request, *args, **kwargs):
        id = request.query_params.get('id')
        if id:
            try:
                category = Category.objects.get(id=id)
                category_name = category.category
                category.delete()
                return Response({'msg': f'Brand {category_name} deleted successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'msg': 'invalid id'}, status=status.HTTP_403_FORBIDDEN)

class SubCategoryView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
          store_code = request.query_params.get('store')
          store = get_object_or_404(Store, store_code=store_code)

          if store_code :
              subcategory = SubCategory.objects.filter(store=store)
          else:
              subcategory = SubCategory.objects.none()

          categories = Category.objects.filter(store=store)
        #   serializer = SubCategorySerializer(category, many=True)
          serializer = {
            'subcategories': SubCategorySerializer(subcategory, many=True).data,
            'categories': CategoryListSerializer(categories, many=True).data
           }
          return Response(serializer, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        serializer = SubCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        store_code = request.data.get('stor_code')
        cat = request.data.get('category')
        store = get_object_or_404(Store, store_code=store_code)
        category = get_object_or_404(Category, id=cat)
        user = self.request.user
        serializer.validated_data['store'] = store
        serializer.validated_data['category'] = category 
        serializer.validated_data['createdby'] = user

        serializer.save()
        return Response({'msg': 'SubCategory added'}, status=status.HTTP_201_CREATED)
   
    def patch(self,request,*args,**kwargs):
      id = request.query_params.get('id')
      cat = request.data.get('category')
      if id:
        try:
          subcategory = SubCategory.objects.get(id=id)
          subcategory_name = subcategory.subcategory
          serializer = SubCategorySerializer(subcategory,data=request.data, partial= True)
          if serializer.is_valid():
             if cat:
                 category = get_object_or_404(Category, id=cat)
                 serializer.validated_data['category'] = category
             serializer.save()
             return Response({'msg': f'Brand {subcategory_name} updated'}, status=status.HTTP_200_OK)
          return Response({'msg': 'invalid data'}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'msg': 'invalid id'}, status=status.HTTP_403_FORBIDDEN)
    
    def delete(self, request, *args, **kwargs):
        id = request.query_params.get('id')
        print(id)
        if id:
            try:
                subCategory = SubCategory.objects.get(id=id)
                subCategory_name = subCategory.subcategory
                subCategory.delete()
                return Response({'msg': f'Sub Category {subCategory_name} deleted successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'msg': 'invalid id'}, status=status.HTTP_403_FORBIDDEN)

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
              category = Brand.objects.filter(store=store, name__icontains=name)
          elif store_code:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users only by store
              category = Brand.objects.filter(store=store)
          else:
              # Handle the case where store_code is not provided
              category = Brand.objects.none()
          serializer = BrandSerializer(category, many=True, context={'request': request})
          return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        serializer = BrandSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        store_code = request.data.get('stor_code')
        store = get_object_or_404(Store, store_code=store_code)
        serializer.validated_data['store'] = store
        serializer.save()

        return Response({'msg': 'Brand added'}, status=status.HTTP_201_CREATED)
    
    def patch(self,request,*args,**kwargs):
      id = request.query_params.get('id')
      print(id)
      if id:
        try:
          brand = Brand.objects.get(id=id)
          brand_name = brand.brand
          serializer = BrandSerializer(brand,data=request.data, partial= True)
          print(request.data)
          if serializer.is_valid():
             serializer.save()
             return Response({'msg': f'Brand {brand_name} updated'}, status=status.HTTP_200_OK)
          return Response({'msg': 'invalid data'}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'msg': 'invalid id'}, status=status.HTTP_403_FORBIDDEN)
    
    def delete(self, request, *args, **kwargs):
        id = request.query_params.get('id')
        if id:
            try:
                brand = Brand.objects.get(id=id)
                brand_name = brand.brand
                brand.delete()
                return Response({'msg': f'Brand {brand_name} deleted successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'msg': 'invalid id'}, status=status.HTTP_403_FORBIDDEN)

class ProductsView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ProductsSerializer(data=request.data)
        store = request.data.get('stor_code')
        cat = request.data.get('category')
        subcat = request.data.get('subcategory')
        bran = request.data.get('brand')
        user = self.request.user

        try:
            store = Store.objects.get(store_code = store)
        except Store.DoesNotExist:
            return Response({'error':'Store does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        brand = get_object_or_404(Brand, id=bran)
        subcategory = get_object_or_404(SubCategory, id=subcat)
        category = get_object_or_404(Category, id=cat)
        
        if serializer.is_valid(raise_exception=True):
           serializer.save(store = store ,category=category ,brand=brand ,subcategory=subcategory , createdby = user)
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
          serializer = ProductsSerializer(product, many=True,context={'request': request})
          return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        id = request.query_params.get('id')
        if id:
            try:
                product = Products.objects.get(id=id)
                product_name = product.product_name
                product.delete()
                return Response({'msg': f'{product_name} is deleted successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'msg': 'invalid id'}, status=status.HTTP_403_FORBIDDEN)

class ForeignKeyView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
          store_code = request.query_params.get('store')
          store = get_object_or_404(Store, store_code=store_code)

          categories = Category.objects.filter(store=store)
          subcategory = SubCategory.objects.filter(store = store)
          brand = Brand.objects.filter(store = store)
          unit_choices = [
            {"unit":'Kg'},
            {"unit":'Pc'},
        ]
          serializer = {
            'subcategories': SubCategoryListSerializer(subcategory, many=True).data,
            'brand': BrandListSerializer(brand, many=True).data,
            'categories': CategoryListSerializer(categories, many=True).data,
            'unit_choices': unit_choices,
           }
          return Response(serializer, status=status.HTTP_200_OK)
 
class ExpiredProductView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
          store_code = request.query_params.get('store')

          if store_code:
              # Get the store object by store code
              store = get_object_or_404(Store, store_code=store_code)
              # Filter users only by store
              product = Products.objects.filter(store = store, manuf_date__isnull=False, exp_date__isnull=False)
          else:
              # Handle the case where store_code is not provided
              product = Products.objects.none()
          serializer = ProductsSerializer(product, many=True,context={'request': request})
          return Response(serializer.data, status=status.HTTP_200_OK)
 