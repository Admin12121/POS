import uuid
import random
import string
from django.db import models
from django.core.validators import FileExtensionValidator
from Accounts.models import User, Group
 #  Custom User Manager
def generate_random_code():
     return random.randint(10000, 99999)


# Create your models here.

class Store(models.Model):
    CATEGORY=(
        ('Restront','Restront'),
        ('Store', 'Store'),
    )
    name = models.CharField(max_length=100, null=True)
    store_owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    store_type = models.CharField(max_length=100, choices=CATEGORY, null=True, blank=True)
    store_code = models.CharField(max_length=20, null=True, blank=True)
    def generate_store_code(self):
        # Generate a random string of uppercase letters and digits
        random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        # Combine store name abbreviation (first three characters) with random string
        return f'{self.name[:3].upper()}-{random_string}'
    def save(self, *args, **kwargs):
        if not self.store_code:
            self.store_code = self.generate_store_code()
        super().save(*args, **kwargs)
        # Create a group associated with this model instance
        group_name = f'{self.name}' 
        store_code = f'{self.store_code}' # Customize the group name as needed
        group, created = Group.objects.get_or_create(name=group_name)
        group.code = store_code
        group.save()
        if self.store_owner:
            self.store_owner.stor = group
            self.store_owner.save()
            
    def delete(self, *args, **kwargs):
        try:
            group = Group.objects.get(code=self.store_code)
            print(f"Found group with code: {group.code}")
            group.delete()
            print("Group deleted successfully")
        except Group.DoesNotExist:
            print("Group not found for deletion")
            pass
        super().delete(*args, **kwargs)
    def __str__(self):
      return f"{self.name}"

class Department(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    dep_name = models.CharField(max_length=200, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    total = models.IntegerField(blank=True, null=True)
    def __str__(self):
      return f"{self.dep_name} - {self.total}"

class Customers(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True)
    profile = models.ImageField(upload_to='customer_profile/', null=True, blank=True,validators=[ FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])] )
    name = models.CharField(max_length=200, null=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True)
    addresh = models.CharField(max_length=200, null=True)
    city = models.CharField(max_length=200, null=True)
    country = models.CharField(max_length=200, null=True)
    description = models.TextField(max_length=500, null=True , blank=True)
    code = models.CharField(max_length=20, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Generate a random code if not provided
        if not self.code:
            self.code = generate_random_code()
        super().save(*args, **kwargs)
    def __str__(self):
      return f"{self.name} - {self.email}"

