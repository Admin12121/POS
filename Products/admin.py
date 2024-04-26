from django.contrib import admin
from django.utils.html import format_html
from .models import* 
# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category', 'store', 'status', 'created_on', 'categoryslug', 'createdby')


class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('subcategory' ,'category' , 'store', 'createdby')
    search_fields = ('category', 'subcategory','store')

class BrandAdmin(admin.ModelAdmin):
    list_display = ('brand' ,'display_logo' , 'store', 'status')
    search_fields = ('brand', )
    
    def display_logo(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover" />', obj.logo.url)
        else:
            return 'No Image'


class ProductsAdmin(admin.ModelAdmin):
    list_display = ('display_logo' ,'product_name' ,'category', 'subcategory', 'brand' ,'store')
    search_fields = ('product_name','brand', )
    
    def display_logo(self, obj):
        if obj.images:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover" />', obj.images.url)
        else:
            return 'No Image'
    display_logo.short_description = 'Product_Image'
      
class Product_preview_images(admin.ModelAdmin):
    list_display = ('product', 'preview_images')
    search_fields = ('product', )
    
    def preview_images(self, obj):
        if obj.preview_image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover" />', obj.preview_image.url)
        else:
            return 'No Image'
    preview_images.short_description = 'Product_Image'

admin.site.register(Category,CategoryAdmin)
admin.site.register(SubCategory, SubCategoryAdmin)
admin.site.register(Brand,BrandAdmin)
admin.site.register(Products, ProductsAdmin)
admin.site.register(Product_images, Product_preview_images)