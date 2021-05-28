from django.db import models
from django.contrib import admin
from django.utils.html import format_html
from django.forms import CheckboxSelectMultiple

from import_export.admin import ImportExportModelAdmin

from mapsdata.models import Book, Place, Marker, Continent, Map
from mapsdata.resources import PlaceResource, MarkerResource
from mapsdata.filters import PlaceZeroMarkerFilter

admin.site.enable_nav_sidebar = False

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'short_name',
        'cover',
        'wiki_link',
        'cover_image',
    )

    readonly_fields = (
        'cover_image',
    )

    list_display = (
        'name',
        'cover_image',
    )

    def cover_image(self, obj):
        """Generates HTML that displays the cover image of the Book"""
        return format_html(
            '<img href="{0}" src="{0}" width="150" height="150" style="object-fit: contain;" />',
            obj.cover.url
        )


@admin.register(Map)
class MapAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'short_name',
        'continent',
        'image',
        'books',
    )

    list_display = (
        'name',
        'continent',
        'get_books',
        'marker_counter',
        'updated',
    )

    list_filter = (
        'books',
        'continent',
    )

    ordering = (
        '-updated',
    )

    list_per_page = 20

    @admin.display(description='books')
    def get_books(self, obj):
        """Get related books as newline-seperated string"""
        return ", ".join([book.name for book in obj.books.all()])

    @admin.display(description='markers')
    def marker_counter(self, obj):
        """Counter of how much markers are defined for the Map"""
        return len(obj.markers.all())

    formfield_overrides = {
        models.ManyToManyField: {'widget': CheckboxSelectMultiple},
    }


@admin.register(Place)
class PlaceAdmin(ImportExportModelAdmin):
    resource_class = PlaceResource

    fields = (
        'name',
        'short_name',
        'wiki_link',
        'continent',
        'type',
    )

    list_display = (
        'name',
        'type',
        'continent',
        'marker_counter',
    )

    list_filter = (
        'continent',
        'type',
        PlaceZeroMarkerFilter,
    )

    @admin.display(description='markers')
    def marker_counter(self, obj):
        """Counter of how much markers are defined for the Place"""
        return len(obj.markers.all())

    list_per_page = 25

    search_fields = (
        'name',
    )


@admin.register(Continent)
class ContinentAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'short_name',
        'wiki_link',
    )

    list_display = (
        'name',
    )


@admin.register(Marker)
class MarkerAdmin(ImportExportModelAdmin):
    resource_class = MarkerResource

    fields = (
        'place',
        ('x', 'y'),
        'map',
    )

    list_display = (
        'place',
        'get_type',
        'x',
        'y',
        'map',
    )

    list_filter = (
        'map',
    )

    list_per_page = 25

    search_fields = (
        'place__name',
    )

    @admin.display(description='type')
    def get_type(self, instance):
        """Get Type of the related place"""
        return instance.place.type