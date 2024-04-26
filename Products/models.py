from django.db import models
from Accounts.models import User
from Stotes.models import Store
from django.core.validators import FileExtensionValidator
from django.core.files.storage import FileSystemStorage
from django.conf import settings

# Create your models here.

class Category(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    category = models.CharField(max_length=200,unique=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField()
    categoryslug = models.CharField(max_length=100)
    createdby = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None)
    def __str__(self):
        return self.category

class SubCategory(models.Model):
    store = models.ForeignKey(Store, on_delete=models.SET_DEFAULT,default=None, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    subcategory = models.CharField(max_length=200,unique=True, null=True)
    categorycode = models.CharField(max_length=20, null=True)
    description = models.CharField(max_length=500, null=True)
    createdby = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None)
    def __str__(self):
        return self.subcategory

class Brand(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE,null=True)
    brand = models.CharField(max_length=100,unique=True, null=True)
    logo = models.ImageField(upload_to='brand/', null=True, blank=True,validators=[ FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])] )
    status = models.BooleanField()
    created_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.brand
    

class Products(models.Model):
    UNIT=(
        ('Kg','Kg'),
        ('Pc', 'Pc'),
    )
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    product_name = models.CharField(max_length=500,unique=True,null=True)
    slug = models.CharField(max_length=100, blank=True)
    sku = models.CharField(max_length=100, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_DEFAULT, default=None, null=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_DEFAULT, default=None, null=True)
    brand = models.ForeignKey(Brand, on_delete=models.SET_DEFAULT, default=None, null=True)
    unit = models.CharField(max_length=200, null=True, choices=UNIT)
    barcode = models.CharField(max_length=300, null=True)
    itemcode = models.CharField(max_length=100, null=True)
    description = models.TextField(max_length=1000)
    single = models.BooleanField(null=True, blank=True)
    variable = models.BooleanField(null=True,blank=True)
    quantity = models.IntegerField()
    price = models.IntegerField()
    tax_type =  models.CharField(max_length=200, null=True, blank=True)
    discount_type = models.CharField(max_length=100, null=True, blank=True)
    discount_value = models.IntegerField(null=True, blank=True)
    quantity_alert = models.IntegerField(null=True,  blank=True)
    images = models.ImageField(upload_to='products/', null=True, blank=True,validators=[ FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])] )
    manuf_date = models.CharField(max_length=50, null=True)
    exp_date = models.CharField(max_length=50, null=True,blank=True)
    createdby = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None , null=True)

    def __str__(self):
      return f"{self.product_name}"
    
class Product_images(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE,related_name="product_images", null=True, blank=True)
    preview_image = models.ImageField(upload_to="products/product_prev_image", null=True, validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])])
    def __str__(self):
      return f"{self.product}"