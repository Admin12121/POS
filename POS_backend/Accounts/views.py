from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import *
from django.contrib.auth import authenticate
from .renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.decorators import permission_classes
from django.utils.encoding import force_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.permissions import IsAuthenticated , IsAuthenticatedOrReadOnly
from .tokens import generate_token
from rest_framework.pagination import PageNumberPagination
from POS_backend import settings
from django.core.mail import EmailMessage
import random
from django.shortcuts import get_object_or_404
# Generate Token Manually
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class AdminRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = AdminRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    myuser = serializer.save()
    # Welcome Email
    subject = "Welcome to genzcoder !!"
    message = "Hello " + myuser.first_name + "!! \n" + "Thank you for signing up for genzcoder\n. please verify your email addresh to active your accout that we have sent \n\n  Getting Start on genzcoder \n\n Ready to get coding? Here are a few links to help you!  \n    Quick overview of what youcan do with genzcoder \n     Take a guide tour through the pen editor \n\nThanking You\n Need help with anything ? Hit up support. "        
    from_email = settings.EMAIL_HOST_USER
    to_list = [myuser.email]
    send_mail(subject, message, from_email, to_list, fail_silently=True)
    
    # Email Address Confirmation Email
    email_subject = "Confirm your email addresh !!"
    message2 = render_to_string('email_confirmation.html',{
        
        'name': myuser.first_name,
        'domain': 'localhost:5173',
        'uid': urlsafe_base64_encode(force_bytes(myuser.pk)),
        'token': generate_token.make_token(myuser)
    })
    email = EmailMessage(
    email_subject,
    message2,
    settings.EMAIL_HOST_USER,
    [myuser.email],
    )
    email.fail_silently = True
    email.send()
    
    return Response({'msg':'Registration Successful, Check your Email to Verify Your Account'}, status=status.HTTP_201_CREATED)

class UserRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    myuser = serializer.save()
    # Welcome Email
    subject = "Welcome to genzcoder !!"
    message = "Hello " + myuser.first_name + "!! \n" + "Thank you for signing up for genzcoder\n. please verify your email addresh to active your accout that we have sent \n\n  Getting Start on genzcoder \n\n Ready to get coding? Here are a few links to help you!  \n    Quick overview of what youcan do with genzcoder \n     Take a guide tour through the pen editor \n\nThanking You\n Need help with anything ? Hit up support. "        
    from_email = settings.EMAIL_HOST_USER
    to_list = [myuser.email]
    send_mail(subject, message, from_email, to_list, fail_silently=True)
    
    # Email Address Confirmation Email
    email_subject = "Confirm your email addresh !!"
    message2 = render_to_string('email_confirmation.html',{
        
        'name': myuser.first_name,
        'domain': 'localhost:5173',
        'uid': urlsafe_base64_encode(force_bytes(myuser.pk)),
        'token': generate_token.make_token(myuser)
    })
    email = EmailMessage(
    email_subject,
    message2,
    settings.EMAIL_HOST_USER,
    [myuser.email],
    )
    email.fail_silently = True
    email.send()
    
    return Response({'msg':'Registration Successful, Check your Email to Verify Your Account'}, status=status.HTTP_201_CREATED)

class UserActivationView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            myuser = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            myuser = None

        if myuser is not None and generate_token.check_token(myuser, token):
            myuser.is_active = True
            myuser.save()
            return Response({'msg': 'Your account has been activated successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Activation link is invalid or expired.'}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.data.get('email')
    password = serializer.data.get('password')

    user = authenticate(email=email, password=password)

    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'token':token, 'msg':'Login Success'}, status=status.HTTP_200_OK)
    else:
        try:
            User.objects.get(email=email)    # Checking if email exist
            return Response({'errors': {'non_field_errors': ["Password doesn't match"]}}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:            # Checking if User Input wrong password
            return Response({'errors': {'email': ["Email is not Valid"]}}, status=status.HTTP_404_NOT_FOUND) 
  
class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendUserPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendUserPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)

class AllUsersView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
         name = request.query_params.get('name')
         store_code = request.query_params.get('store')
         
         if store_code and name:
            store = get_object_or_404(Store, store_code=store_code)
            group = get_object_or_404(Group, name=store)
            users = User.objects.filter(stor=group, name__icontains=name)
         elif store_code:
            store = get_object_or_404(Store, store_code=store_code)
            group = get_object_or_404(Group, name=store)
            users = User.objects.filter(stor=group)
         else:
            users = User.objects.none()
         serializer = UserDataSerializer(users, many=True)
         return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
         user = request.user
         
         if user:
            serializer = UserDataSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
         else:
            return Response({"detail": "Some thing went wrong user does not exist"}, status=status.HTTP_404_NOT_FOUND)

    