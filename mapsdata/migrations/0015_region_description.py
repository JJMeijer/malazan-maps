# Generated by Django 3.2.2 on 2021-05-22 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapsdata', '0014_auto_20210518_2043'),
    ]

    operations = [
        migrations.AddField(
            model_name='region',
            name='description',
            field=models.CharField(default='-', max_length=2000),
        ),
    ]
