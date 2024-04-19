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

class StoreRegistrationSerializer(serializers.ModelSerializer):
    owner_email = serializers.CharField(write_only=True)
    class Meta:
        model = Store
        fields = ['name','owner_email']

    def validate(self, attrs):
        user_email = attrs.get('owner_email')
        
        # Check if the user exists
        if not User.objects.filter(email=user_email).exists():
            raise serializers.ValidationError("User doesn't exist")

        # Retrieve the user object
        user = User.objects.get(email=user_email)

        # Check if the user is an admin
        if not user.is_admin:
            raise serializers.ValidationError("User does not have permission to create a store")

        return attrs

    def create(self, validated_data):
        # Create the store with the validated data
        email = validated_data.pop('owner_email')
        user = User.objects.get(email = email)
        store = Store.objects.create(
            name=validated_data['name'],
            store_owner= user
        )
        group = Group.objects.get(code = store.store_code)
        user.stor = group
        user.save()
        return store             



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