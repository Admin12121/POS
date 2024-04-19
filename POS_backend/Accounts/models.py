import uuid
import random
import string
from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, Group
from django.core.exceptions import PermissionDenied
 #  Custom User Manager
def generate_random_code():
     return random.randint(10000, 99999)

class UserManager(BaseUserManager):
     def create_user(self, email, first_name, last_name, phone, password=None, password2=None, stor_code=None, **extra_fields):
         """
         Creates and saves a User with the given email, name, and password.
         """
         if not email:
             raise ValueError('User must have an email address')

         user = self.model(
             email=self.normalize_email(email),
             first_name=first_name,
             last_name=last_name,
             phone=phone,
             **extra_fields
         )
         user.set_password(password)
         user.save(using=self._db)
         return user

     def create_superuser(self, email, first_name, last_name, phone, password=None, password2=None, **extra_fields):
         """
         Creates and saves a superuser with the given email, name, and password.
         """
         extra_fields.setdefault('is_superuser', True)
         extra_fields.setdefault('is_admin', True)

         if extra_fields.get('is_superuser') is not True:
             raise ValueError('Superuser must have is_superuser=True.')
         return self.create_user(email,  first_name, last_name, phone, password, **extra_fields)

class User(AbstractBaseUser):
     email = models.EmailField(
             verbose_name='Email',
             max_length=255,
             unique=True,
     )
     profile = models.ImageField(upload_to='profile/', null=True, blank=True,validators=[ FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])] )    
     name = models.CharField(max_length=200,blank=True)
     first_name=models.CharField(max_length=200,blank=True)
     last_name=models.CharField(max_length=200,blank=True)
     phone=models.CharField(max_length=15,blank=True)
     dob = models.CharField(max_length=10,null=True, blank=True)
     gender = models.CharField(max_length=10, null=True, blank=True)
     employee_role = models.CharField(max_length=200, blank=True, null=True)
     employee_id = models.CharField(max_length=10, editable=False, blank=True, null=True)
     is_active = models.BooleanField(default=True)
     is_admin = models.BooleanField(default=False)
     is_superuser = models.BooleanField(default=False)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     last_login = models.DateTimeField(blank=True, null=True)
     stor = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True)

     def save(self, *args, **kwargs):
         if not self.employee_id:
             # Generate employee ID in the POS001 pattern
             last_id = User.objects.order_by('-employee_id').first()
             if last_id:
                 last_number_str = last_id.employee_id[3:]  # Extract numeric part as string
                 new_number = int(last_number_str) + 1
             else:
                 new_number = 1
             self.employee_id = f'POS{str(new_number).zfill(3)}'
         if not self.name:
             # Concatenate first_name and last_name, convert to lowercase
             full_name = f"{self.first_name} {self.last_name}".lower().replace(" ", "")
             # Generate a unique identifier (UUID)
             unique_suffix = uuid.uuid4().hex[:6]  # Use the first 6 characters of the UUID
             # Combine full_name and unique_suffix
             self.name = f"{full_name}{unique_suffix}"
             # Ensure name is unique
             while User.objects.filter(name=self.name).exists():  # Change YourModel to User
                 unique_suffix = uuid.uuid4().hex[:6]  # Generate new unique_suffix
                 self.name = f"{full_name}{unique_suffix}"
         super().save(*args, **kwargs)

     objects = UserManager()
     USERNAME_FIELD = 'email'
     REQUIRED_FIELDS = ['first_name','last_name','phone']

     def __str__(self):
             return self.email

     def has_perm(self, perm, obj=None):
         "Does the user have a specific permission?"
         # Simplest possible answer: Yes, always
         return self.is_admin

     def has_module_perms(self, app_label):
         "Does the user have permissions to view the app `app_label`?"
         # Simplest possible answer: Yes, always
         return True

     @property
     def is_staff(self):
         "Is the user a member of staff?"
         # Simplest possible answer: All admins are staff
         return self.is_admin




