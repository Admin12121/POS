from django.db import models
from Accounts.models import User
from Stotes.models import Store
from django.core.validators import FileExtensionValidator

# Create your models here.

class Category(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    category = models.CharField(max_length=200, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField()
    categoryslug = models.CharField(max_length=100)
    def __str__(self):
        return self.category

class SubCategory(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory = models.CharField(max_length=200, null=True)
    categorycode = models.CharField(max_length=20, null=True)
    description = models.CharField(max_length=500, null=True)
    createdby = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None)
    def __str__(self):
        return self.category

class Brand(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    brand = models.CharField(max_length=100, null=True)
    logo = models.ImageField(upload_to='profile/', null=True, blank=True,validators=[ FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])] )
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
    product_name = models.CharField(max_length=500, blank=True)
    slug = models.CharField(max_length=100, blank=True)
    sku = models.CharField(max_length=100, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_DEFAULT, default=None)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_DEFAULT, default=None)
    brand = models.ForeignKey(Brand, on_delete=models.SET_DEFAULT, default=None)
    unit = models.CharField(max_length=200, null=True, choices=UNIT)
    barcode = models.CharField(max_length=300, null=True)
    itemcode = models.CharField(max_length=100, null=True)
    description = models.TextField(max_length=1000, null=True)
    single = models.BooleanField()
    variable = models.BooleanField()
    quantity = models.IntegerField()
    price = models.IntegerField()
    tax_type =  models.CharField(max_length=200, null=True)
    discount_type = models.CharField(max_length=100, null=True)
    discount_value = models.IntegerField()
    quantity_alert = models.IntegerField()
    images = models.ImageField(upload_to='profile/', null=True, blank=True,validators=[ FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])] )
    manuf_date = models.CharField(max_length=50, null=True)
    exp_date = models.CharField(max_length=50, null=True)
    createdby = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None)

    def __str__(self):
      return f"{self.product_name} - {self.category} - {self.brand} - {self.quantity}"