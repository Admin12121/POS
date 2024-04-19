from django.db import models
from Accounts.models import User
from Stotes.models import Store,Customers
from Products.models import Products
# Create your models here.
class Sales(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True, blank=True)
    costumer_name = models.ForeignKey(Customers, on_delete=models.SET_DEFAULT, default=None)
    refrence = models.CharField(max_length=20, null=True)
    invoice = models.CharField(max_length=20, null=True)
    created = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField()
    grand_total = models.IntegerField(null=True)
    paid = models.IntegerField(null=True)
    due = models.ImageField(null=True)
    biller = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None)

    def __str__(self):
      return f"{self.costumer_name} - {self.status} - {self.biller}"
    
class SalesReturn(models.Model):
     store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True, blank=True)
     product_name = models.ForeignKey(Products, null=True , on_delete=models.SET_DEFAULT, default=None)
     date = models.DateTimeField(auto_now_add=True)
     customer = models.ForeignKey(Customers, on_delete=models.SET_DEFAULT, default=None)
     status = models.BooleanField()
     grand_total = models.IntegerField(null=True)
     paid = models.IntegerField(null=True)
     due = models.IntegerField(null=True)    
     
     def __str__(self):
      return f"- {self.product_name} - {self.customer} - {self.status} "
    