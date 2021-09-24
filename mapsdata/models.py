from django.db import models
from django.utils import timezone

from .validators import validate_shortname


class Continent(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100, unique=True)
    short_name = models.CharField(max_length=100, null=True, validators=[validate_shortname])
    wiki_link = models.URLField(max_length=200)
    description = models.CharField(max_length=2000, null=False, default='-')

    def __str__(self) -> str:
        return self.name


class Book(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100, verbose_name='title', unique=True)
    short_name = models.CharField(max_length=100, null=True, validators=[validate_shortname])
    cover = models.ImageField(upload_to='covers/', null=True)

    wiki_link = models.URLField(max_length=200)
    description = models.CharField(max_length=2000, null=False, default='-')

    def __str__(self) -> str:
        return self.name


class Map(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=200, unique=True)
    short_name = models.CharField(max_length=200, null=True, validators=[validate_shortname])

    height = models.IntegerField()
    width = models.IntegerField()
    image = models.ImageField(upload_to='maps/', height_field='height', width_field='width')

    priority = models.PositiveIntegerField(
        default=1,
        help_text='Higher priority makes sure the maps is showed before other maps.'
    )

    books = models.ManyToManyField(
        to=Book,
        related_name='maps'
    )

    continent = models.ForeignKey(
        to=Continent,
        related_name='maps',
        on_delete=models.CASCADE,
        null=True
    )

    def __str__(self) -> str:
        return f'{self.name} ({self.width}x{self.height})'


class Place(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100, unique=True)
    short_name = models.CharField(max_length=100, null=True, validators=[validate_shortname])

    wiki_link = models.URLField(max_length=200)
    description = models.CharField(max_length=2000, null=False, default='-')

    PLACE_TYPES = (
        ('city', 'City',),
        ('region', 'Region',),
    )

    type = models.CharField(max_length=6, choices=PLACE_TYPES)

    continent = models.ForeignKey(
        to=Continent,
        related_name='places',
        on_delete=models.CASCADE
    )

    def __str__(self) -> str:
        return self.name


class Marker(models.Model):
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    x = models.IntegerField(verbose_name='X Pixel')
    y = models.IntegerField(verbose_name='Y Pixel')

    map = models.ForeignKey(
        to=Map,
        related_name='markers',
        on_delete=models.CASCADE
    )

    place = models.ForeignKey(
        to=Place,
        related_name='markers',
        on_delete=models.CASCADE
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=(
                    'place',
                    'map',
                ),
                name='unique_place_marker'
            ),
        )

    def __str__(self):
        return f'{self.place} - ({self.x},{self.y})'
