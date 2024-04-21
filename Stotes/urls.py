from django.urls import path
from .views import *


urlpatterns = [
    path('register_store/', RegisterStoreView.as_view(), name='register_store' ),
    path('customers/', CustomersView.as_view(), name='customers'),
    path('register_customers/', RegisterCustomersView.as_view(), name='register_customers'),
    path('department/', DepartmentDataView.as_view(), name='department'),
]
