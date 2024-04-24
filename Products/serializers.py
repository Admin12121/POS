from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"

class SubCategorySerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(read_only=True, slug_field='category')
    createdby = serializers.SlugRelatedField(read_only=True, slug_field='first_name')
    class Meta:
        model = SubCategory
        fields = "__all__"

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

class ProductsSerializer(serializers.ModelSerializer):
    images = serializers.ImageField()
    category = serializers.SlugRelatedField(read_only=True, slug_field='category')
    brand = serializers.SlugRelatedField(read_only=True, slug_field='brand')
    subcategory = serializers.SlugRelatedField(read_only=True, slug_field='subcategory')
    createdby = serializers.SlugRelatedField(read_only=True, slug_field='first_name')
    profile = serializers.SerializerMethodField()

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
