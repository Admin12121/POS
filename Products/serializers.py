from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model : Category
        fields = "__all__"

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model : SubCategory
        fields = "__all__"

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model:Brand
        fields = "__all__"

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model:Products
        fields = "__all__"
