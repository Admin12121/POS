# Generated by Django 4.2.11 on 2024-04-23 07:39

import django.core.files.storage
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Stotes', '0001_initial'),
        ('Products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='products',
            name='images',
            field=models.ImageField(blank=True, null=True, storage=django.core.files.storage.FileSystemStorage(base_url='/media/'), upload_to='profile/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]),
        ),
        migrations.AlterField(
            model_name='products',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Stotes.store'),
        ),
        migrations.AlterField(
            model_name='subcategory',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Products.category'),
        ),
    ]
