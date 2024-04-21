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
   def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.stor:
            group = request.user.stor
            return qs.filter(store__store_owner__stor__code=group.code)
        return qs.none()  # Return an empty queryset if user has no associated group


class UserInfoInline(admin.StackedInline):
     model = User
     can_delete = False
     verbose_name_plural = 'User Profiles'

class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')
    readonly_fields = ('code','name',)  # Assuming 'code' should not be editable in the admin

 # Now register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)
admin.site.register(Group, GroupAdmin)

from django.contrib.auth.models import Group
from django.contrib import admin

admin.site.unregister(Group)
