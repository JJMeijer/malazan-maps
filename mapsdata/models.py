from django.db import models
from django.utils import timezone

from .validators import validate_shortname


class Continent(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    wiki_link = models.URLField(max_length=200)

    def __str__(self) -> str:
        return self.name


class Region(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    wiki_link = models.URLField(max_length=200)

    continent = models.ForeignKey(
        to=Continent,
        related_name='regions',
        on_delete=models.CASCADE
    )

    def __str__(self) -> str:
        return self.name


class Book(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=100)
    cover = models.ImageField(upload_to='covers/', null=True)

    wiki_link = models.URLField(max_length=200)

    def __str__(self) -> str:
        return self.title


class City(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    wiki_link = models.URLField(max_length=200)

    continent = models.ForeignKey(
        to=Continent,
        related_name='cities',
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name_plural = 'cities'

    def __str__(self) -> str:
        return self.name


class Map(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=200)
    short_name = models.CharField(max_length=200, null=True, validators=[validate_shortname])

    height = models.IntegerField()
    width = models.IntegerField()
    image = models.ImageField(upload_to='maps/', height_field='height', width_field='width')

    book = models.ForeignKey(
        to=Book,
        related_name='maps',
        on_delete=models.CASCADE
    )

    def __str__(self) -> str:
        return f'{self.name} ({self.width}x{self.height})'


class CityPointer(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    x = models.IntegerField(verbose_name='X Pixel')
    y = models.IntegerField(verbose_name='Y Pixel')

    map = models.ForeignKey(
        to=Map,
        related_name='city_pointers',
        on_delete=models.CASCADE
    )

    city = models.ForeignKey(
        to=City,
        related_name='city_pointers',
        on_delete=models.CASCADE
    )


class RegionPointer(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    x = models.IntegerField(verbose_name='X Pixel')
    y = models.IntegerField(verbose_name='Y Pixel')

    map = models.ForeignKey(
        to=Map,
        related_name='region_pointers',
        on_delete=models.CASCADE
    )

    region = models.ForeignKey(
        to=Region,
        related_name='region_pointers',
        on_delete=models.CASCADE
    )


class ContinentPointer(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    x = models.IntegerField(verbose_name='X Pixel')
    y = models.IntegerField(verbose_name='Y Pixel')

    map = models.ForeignKey(
        to=Map,
        related_name='continent_pointers',
        on_delete=models.CASCADE
    )

    continent = models.ForeignKey(
        to=Continent,
        related_name='continent_pointers',
        on_delete=models.CASCADE
    )
