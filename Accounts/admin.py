###
from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

 # Register your models here.
class UserModelAdmin(BaseUserAdmin):
   list_display = ( 'email', 'first_name' , 'phone' , 'employee_role' ,'employee_id' ,'stor' , 'is_admin')
   list_filter = ('is_admin',)
   fieldsets = (
       ('User Credentials', {'fields': ('email', 'password')}),
       ('Personal info', {'fields': ('profile','name','first_name','last_name','phone','dob','gender','employee_role','employee_id', 'created_at','last_login')}),
       ('Permissions', {'fields': ( "stor" ,'is_active','is_admin',)}),
   )
   # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
   # overrides get_fieldsets to use this attribute when creating a user.
   add_fieldsets = (
       (None, {
           'classes': ('wide',),
           'fields': ('email', 'first_name','last_name', 'password1', 'password2'),
       }),
   )
   readonly_fields = ('created_at','employee_id')
   search_fields = ( 'name','email','first_name')
   ordering = ('email', 'id')
   filter_horizontal = ()

class UserInfoInline(admin.StackedInline):
     model = User
     can_delete = False
     verbose_name_plural = 'User Profiles'

 # Now register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)
