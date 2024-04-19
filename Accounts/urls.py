from django.urls import path
from .views import *
from rest_framework_simplejwt.views import(
    TokenRefreshView,
)

urlpatterns = [
    path('admin_register/', AdminRegistrationView.as_view(), name='admin_register'),
    path('user_register/', UserRegistrationView.as_view(), name='user_register'),
    path('activate/<str:uidb64>/<str:token>/', UserActivationView.as_view() , name='activate'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('users/', AllUsersView.as_view(), name='all-users'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendUserPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]