from django.contrib import admin
from django.urls import path, include
from django.conf import settings


admin.site.site_header = " Admin"
admin.site.site_title = " Admin Portal"
admin.site.index_title = "Welcome to Admin Dashboard"

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/',include('Accounts.urls')),
    path('sales/', include('Sales.urls')),
    path('products', include('Products.urls')),
    path('store/', include('Stotes.urls')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)