from rest_framework import serializers
from .models import *
from Stotes.models import Store
from django.contrib.auth.models import Group 


class SalesDataSerializer(serializers.ModelSerializer):
    class Meta:
        models = Sales
        fields = "__all__"

class SalesReturnSerializer(serializers.ModelSerializer):
    class Meta:
        models = SalesReturn
        fields = "__all__"