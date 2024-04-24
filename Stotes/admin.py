from django.contrib import admin
from django.contrib.auth.models import User
from django.utils.html import format_html
from .models import *

class StoreAdmin(admin.ModelAdmin):
 # Assuming 'code' should not be editable in the admin
    readonly_fields = ('store_code',)
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "store_owner":
            # Filter queryset to include only admin users
            kwargs["queryset"] = User.objects.filter(is_superuser=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    

class CustomersAdmin(admin.ModelAdmin):
    list_display = ('display_logo' ,'name', 'email', 'phone', 'addresh',  'code')
    search_fields = ('name', 'email', 'phone', 'addresh', 'code')
    readonly_fields = ('code',)  # Assuming 'code' should not be editable in the admin

    def display_logo(self, obj):
        if obj.profile:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover" />', obj.profile.url)
        else:
            return 'No Image'
    display_logo.short_description = 'Profile'
    # def get_queryset(self, request):
    #     qs = super().get_queryset(request)
    #     if request.user.stor:
    #         group = request.user.stor
    #         return qs.filter(store__store_owner__stor__code=group.code)
    #     return qs.none()  # Return an empty queryset if user has no associated group



admin.site.register(Store, StoreAdmin)
admin.site.register(Customers, CustomersAdmin)
