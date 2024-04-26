from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category']

class SubCategorySerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(read_only=True, slug_field='category')
    createdby = serializers.SlugRelatedField(read_only=True, slug_field='first_name')
    class Meta:
        model = SubCategory
        fields = "__all__"

class SubCategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'subcategory']

class BrandSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField()
    class Meta:
        model = Brand
        fields = "__all__"
    def get_logo(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.logo.url)
        return None

class BrandListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'brand']

class UnitSerializer(serializers.Serializer):
    UNIT_CHOICES = [
        ('Kg', 'Kg'),
        ('Pc', 'Pc'),
    ]
    unit = serializers.ChoiceField(choices=UNIT_CHOICES)

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_images
        fields = ['preview_image']


class ProductsSerializer(serializers.ModelSerializer):
    images = serializers.ImageField()
    category = serializers.SlugRelatedField(read_only=True, slug_field='category')
    brand = serializers.SlugRelatedField(read_only=True, slug_field='brand')
    subcategory = serializers.SlugRelatedField(read_only=True, slug_field='subcategory')
    createdby = serializers.SlugRelatedField(read_only=True, slug_field='first_name')
    profile = serializers.SerializerMethodField()
    product_images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Products
        fields = '__all__'

    def get_profile(self, obj):
        request = self.context.get('request')
        if obj.createdby and obj.createdby.profile:
            return request.build_absolute_uri(obj.createdby.profile.url)
        return None
    
    def get_images(self, obj):
        if obj.images:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.images.url)
        return None

