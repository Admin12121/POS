from django.contrib import admin
from django.contrib.auth.models import User
from .models import *

class StoreAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "store_owner":
            # Filter queryset to include only admin users
            kwargs["queryset"] = User.objects.filter(is_superuser=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
admin.site.register(Store, StoreAdmin)
admin.site.register(Customers)
admin.site.register(Group)

from django.contrib.auth.models import Group
from django.contrib import admin

admin.site.unregister(Group)