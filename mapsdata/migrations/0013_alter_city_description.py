# Generated by Django 3.2.2 on 2021-05-17 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapsdata', '0012_city_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='city',
            name='description',
            field=models.CharField(default='-', max_length=2000),
        ),
    ]