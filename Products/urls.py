from django.urls import path
from .views import *


urlpatterns = [
    path('category/', CategoryView.as_view(), name='category'),
    path('subcategory/', SubCategoryView.as_view(), name='subcategory'),
    path('brand/', BrandView.as_view(), name='brand'),
    path('products/', ProductsView.as_view(), name='products'),
    path('foreignkey/', ForeignKeyView.as_view(), name='foreignkey_view'),
]
