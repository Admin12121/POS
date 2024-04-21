from rest_framework import serializers
from .models import *


class SalesDataSerializer(serializers.ModelSerializer):
    class Meta:
        models = Sales
        fields = "__all__"

class SalesReturnSerializer(serializers.ModelSerializer):
    class Meta:
        models = SalesReturn
        fields = "__all__"