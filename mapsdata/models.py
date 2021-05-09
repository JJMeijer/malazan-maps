from django.db import models
from django.utils import timezone

class BaseModel(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    wiki_link = models.URLField(max_length=200)

    def __str__(self) -> str:
        return f'{self.name}'


class Continent(BaseModel):
    name = models.CharField(max_length=100)


class Region(BaseModel):
    name = models.CharField(max_length=100)

    continent = models.ForeignKey(
        to=Continent,
        related_name='regions',
        on_delete=models.CASCADE
    )


class Book(BaseModel):
    name = models.CharField(max_length=100)


class City(BaseModel):
    name = models.CharField(max_length=100)

    continent = models.ForeignKey(
        to=Continent,
        related_name='cities',
        on_delete=models.CASCADE
    )

    book = models.ForeignKey(
        to=Book,
        related_name='cities',
        on_delete=models.CASCADE
    )


class Map(BaseModel):
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='maps/', height_field='height', width_field='width')


class CityPointer(BaseModel):
    x = models.DecimalField(max_digits=5, decimal_places=4, verbose_name='X Coordinate')
    y = models.DecimalField(max_digits=4, decimal_places=4, verbose_name='Y Coordinate')

    map = models.ForeignKey(
        to=Map,
        related_name='pointers',
        on_delete=models.CASCADE
    )

    city = models.ForeignKey(
        to=City,
        related_name='pointers',
        on_delete=models.CASCADE
    )


class RegionPointer(BaseModel):
    x = models.DecimalField(max_digits=5, decimal_places=4, verbose_name='X Coordinate')
    y = models.DecimalField(max_digits=4, decimal_places=4, verbose_name='Y Coordinate')

    map = models.ForeignKey(
        to=Map,
        related_name='pointers',
        on_delete=models.CASCADE
    )

    region = models.ForeignKey(
        to=Region,
        related_name='pointers',
        on_delete=models.CASCADE
    )


class ContinentPointer(BaseModel):
    x = models.DecimalField(max_digits=5, decimal_places=4, verbose_name='X Coordinate')
    y = models.DecimalField(max_digits=4, decimal_places=4, verbose_name='Y Coordinate')

    map = models.ForeignKey(
        to=Map,
        related_name='pointers',
        on_delete=models.CASCADE
    )

    continent = models.ForeignKey(
        to=Continent,
        related_name='pointers',
        on_delete=models.CASCADE
    )


