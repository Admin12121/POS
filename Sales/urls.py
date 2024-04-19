from django.urls import path
from .views import *


urlpatterns = [
    path('sales/', SalesDataView.as_view(), name='sales'),
    path('salesreturn/', SalesReturnView.as_view(), name='salesreturn'),
]
