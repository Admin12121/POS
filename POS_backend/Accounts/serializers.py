from rest_framework import serializers
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from .utils import Util
from .models import *
from Stotes.models import Store 
#User
class UserRegistrationSerializer(serializers.ModelSerializer):
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
  stor_code = serializers.CharField(write_only=True)
  class Meta:
    model = User
    fields=['email', 'first_name', 'last_name', 'stor_code', 'phone', 'dob', 'gender', 'employee_role','tc', 'password', 'password2']
    extra_kwargs={
      'password':{'write_only':True}
    }

  # Validating Password and Confirm Password while Registration
  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    stor_code = attrs.get('stor_code')
    if not Group.objects.filter(code = stor_code).exists():
       raise serializers.ValidationError("Store is not Registered")
    return attrs
    
  
  #Email validator
  def validate_email(self, value):
        """
        Validate that the email is not already in use.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email address is already in use.")
        return value
   

  def create(self, validate_data):
    code = validate_data.pop('stor_code')
    group = Group.objects.get(code = code)
    user =  User.objects.create_user(**validate_data)
    user.is_active = False
    user.stor = group
    user.save()
    # default_group = Group.objects.get(name='default')
    # user.groups.add(default_group)
    return user

class AdminRegistrationSerializer(serializers.ModelSerializer):
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
  class Meta:
    model = User
    fields=['email', 'first_name', 'last_name' ,'phone', 'password', 'password2','tc']
    extra_kwargs={
      'password':{'write_only':True}
    }

  # Validating Password and Confirm Password while Registration
  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    return attrs
  
  #Email validator
  def validate_email(self, value):
        """
        Validate that the email is not already in use.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email address is already in use.")
        return value
   

  def create(self, validate_data):
    user =  User.objects.create_superuser(**validate_data)
    user.is_superuser=True
    user.is_active = False
    user.save()
    # default_group = Group.objects.get(name='default')
    # user.groups.add(default_group)
    return user

class UserLoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']

class UserDataSerializer(serializers.ModelSerializer):
      stor = serializers.SerializerMethodField()

      def get_stor(self, obj):
          if obj.stor:
            return {
                'name': obj.stor.name,
                'code': obj.stor.code
            }
          else:
              return None
      class Meta:
        model = User
        exclude = ['password']
      
      def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.is_admin:
            data['is_admin'] = True
            data.pop('is_superuser', None)
            data.pop('is_active', None)
        else:
            # If the user is not admin, remove is_superuser and is_active from the data
            data.pop('is_admin', None)
            data.pop('is_superuser', None)
            data.pop('is_active', None)
        return data

class UserChangePasswordSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']

  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    user = self.context.get('user')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    user.set_password(password)
    user.save()
    return attrs

class SendUserPasswordResetEmailSerializer(serializers.Serializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    fields = ['email']

  def validate(self, attrs):
    email = attrs.get('email')
    if User.objects.filter(email=email).exists():
      user = User.objects.get(email = email)
      uid = urlsafe_base64_encode(force_bytes(user.id))
      print('Encoded UID', uid)
      token = PasswordResetTokenGenerator().make_token(user)
      print('Password Reset Token', token)
      link = 'http://localhost:3000/api/user/reset/'+uid+'/'+token
      print('Password Reset Link', link)
      # Send EMail
      body = 'Click Following Link to Reset Your Password ' + link
      data = {
        'subject':'Reset Your Password',
        'body':body,
        'to_email':user.email
      }
      Util.send_email(data)
      return attrs
    else:
      raise serializers.ValidationError('You are not a Registered User')

class UserPasswordResetSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']

  def validate(self, attrs):
    try:
      password = attrs.get('password')
      password2 = attrs.get('password2')
      uid = self.context.get('uid')
      token = self.context.get('token')
      if password != password2:
        raise serializers.ValidationError("Password and Confirm Password doesn't match")
      id = smart_str(urlsafe_base64_decode(uid))
      user = User.objects.get(id=id)
      if not PasswordResetTokenGenerator().check_token(user, token):
        raise serializers.ValidationError('Token is not Valid or Expired')
      user.set_password(password)
      user.save()
      return attrs
    except DjangoUnicodeDecodeError as identifier:
      PasswordResetTokenGenerator().check_token(user, token)
      raise serializers.ValidationError('Token is not Valid or Expired')
  
