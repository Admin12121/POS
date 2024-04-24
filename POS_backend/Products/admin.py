from django.contrib import admin
from django.utils.html import format_html
from .models import* 
# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category', 'store', 'status', 'created_on', 'categoryslug', 'createdby')
    search_fields = ('category','store')
    # def get_queryset(self, request):
    #     qs = super().get_queryset(request)
    #     if request.user.stor:
    #         group = request.user.stor
    #         return qs.filter(store__store_owner__stor__code=group.code)
    #     return qs.none()  # Return an empty queryset if user has no associated group


class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('subcategory' ,'category' , 'store', 'createdby')
    search_fields = ('category', 'subcategory','store')
    # def get_queryset(self, request):
    #     qs = super().get_queryset(request)
    #     if request.user.stor:
    #         group = request.user.stor
    #         return qs.filter(store__store_owner__stor__code=group.code)
    #     return qs.none()  # Return an empty queryset if user has no associated group


class BrandAdmin(admin.ModelAdmin):
    list_display = ('brand' ,'display_logo' , 'store', 'status')
    search_fields = ('brand', )
    
    def display_logo(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover" />', obj.logo.url)
        else:
            return 'No Image'
    # display_logo.short_description = 'Logo'
    # def get_queryset(self, request):
    #     qs = super().get_queryset(request)
    #     if request.user.stor:
    #         group = request.user.stor
    #         return qs.filter(store__store_owner__stor__code=group.code)
    #     return qs.none()  # Return an empty queryset if user has no associated group
    


class ProductsAdmin(admin.ModelAdmin):
    list_display = ('display_logo' ,'product_name' ,'category', 'subcategory', 'brand' ,'store')
    search_fields = ('product_name','brand', )
    
    def display_logo(self, obj):
        if obj.images:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover" />', obj.images.url)
        else:
            return 'No Image'
    display_logo.short_description = 'Product_Image'
    
    # def get_queryset(self, request):
    #     qs = super().get_queryset(request)
    #     if request.user.stor:
    #         group = request.user.stor
    #         return qs.filter(store__store_owner__stor__code=group.code)
    #     return qs.none()  # Return an empty queryset if user has no associated group
    
admin.site.register(Category,CategoryAdmin)
admin.site.register(SubCategory, SubCategoryAdmin)
admin.site.register(Brand,BrandAdmin)
admin.site.register(Products, ProductsAdmin)