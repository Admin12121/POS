from django.urls import path
from .views import *
from rest_framework_simplejwt.views import(
    TokenRefreshView,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('activate/<str:uidb64>/<str:token>/', UserActivationView.as_view() , name='activate'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('users/', AllUsersView.as_view(), name='all-users'),
    # path('customer/', CustomersView.as_view(), name='customer'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendUserPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]