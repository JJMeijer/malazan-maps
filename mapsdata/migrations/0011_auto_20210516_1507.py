# Generated by Django 3.2.2 on 2021-05-16 13:07

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('mapsdata', '0010_auto_20210515_1555'),
    ]

    operations = [
        migrations.CreateModel(
            name='CityMarker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('x', models.IntegerField(verbose_name='X Pixel')),
                ('y', models.IntegerField(verbose_name='Y Pixel')),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='city_markers', to='mapsdata.city')),
                ('map', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='city_markers', to='mapsdata.map')),
            ],
        ),
        migrations.CreateModel(
            name='RegionMarker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('x', models.IntegerField(verbose_name='X Pixel')),
                ('y', models.IntegerField(verbose_name='Y Pixel')),
                ('map', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='region_markers', to='mapsdata.map')),
                ('region', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='region_markers', to='mapsdata.region')),
            ],
        ),
        migrations.RemoveField(
            model_name='regionpointer',
            name='map',
        ),
        migrations.RemoveField(
            model_name='regionpointer',
            name='region',
        ),
        migrations.DeleteModel(
            name='CityPointer',
        ),
        migrations.DeleteModel(
            name='RegionPointer',
        ),
    ]
