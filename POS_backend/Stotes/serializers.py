from rest_framework import serializers
from .models import *



class CustomersDataSerializer(serializers.ModelSerializer):
       store = serializers.SerializerMethodField()

       def get_store(self, obj):
            if obj.store:
                return obj.store.name
            else:
                return None
       class Meta:
        model = Customers
        fields = "__all__"


class DepartmentDataSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    def get_user(sef, obj):
        if obj.user:
            return obj.user.name
        else:
            return None
    class Meta:
        model = Department
        fields = "__all__"