# Generated by Django 3.2.2 on 2021-05-11 13:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mapsdata', '0004_map_book'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='city',
            name='book',
        ),
    ]
