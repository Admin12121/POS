# Generated by Django 4.2.11 on 2024-04-23 07:51

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0002_alter_products_images_alter_products_store_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='products',
            name='images',
            field=models.ImageField(blank=True, null=True, upload_to='profile/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]),
        ),
    ]
