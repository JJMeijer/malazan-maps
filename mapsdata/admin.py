from django.db import models
from django.contrib import admin
from django.utils.html import format_html
from django.forms import CheckboxSelectMultiple

from import_export.admin import ImportExportModelAdmin

from .models import Book, City, Region, Continent, Map, CityMarker, RegionMarker, ContinentMarker
from .resources import CityMarkerResource, CityResource, RegionResource
from .resources import RegionMarkerResource, ContinentMarkerResource

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
        return len(obj.city_markers.all()) + len(obj.region_markers.all())

    formfield_overrides = {
        models.ManyToManyField: {'widget': CheckboxSelectMultiple},
    }


@admin.register(City)
class CityAdmin(ImportExportModelAdmin):
    resource_class = CityResource

    fields = (
        'name',
        'short_name',
        'wiki_link',
        'continent',
    )

    list_display = (
        'name',
        'continent',
        'marker_counter',
    )

    list_filter = (
        'continent',
    )

    @admin.display(description='markers')
    def marker_counter(self, obj):
        """Counter of how much markers are defined for the City"""
        return len(obj.city_markers.all())


@admin.register(Region)
class RegionAdmin(ImportExportModelAdmin):
    resource_class = RegionResource

    fields = (
        'name',
        'short_name',
        'wiki_link',
        'continent',
    )

    list_display = (
        'name',
        'continent',
        'marker_counter',
    )

    @admin.display(description='markers')
    def marker_counter(self, obj):
        """Counter of how much markers are defined for the Region"""
        return len(obj.region_markers.all())


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


@admin.register(CityMarker)
class CityMarkerAdmin(ImportExportModelAdmin):
    resource_class = CityMarkerResource

    fields = (
        'city',
        'x',
        'y',
        'map',
    )

    list_display = (
        'city',
        'x',
        'y',
        'map',
    )

    list_filter = (
        'city',
        'map',
    )

    list_per_page = 25

    search_fields = (
        'city__name',
    )


@admin.register(RegionMarker)
class RegionMarkerAdmin(ImportExportModelAdmin):
    resource_class = RegionMarkerResource

    fields = (
        'region',
        'x',
        'y',
        'map',
    )

    list_display = (
        'region',
        'x',
        'y',
        'map',
    )

    list_filter = (
        'region',
        'map',
    )

    list_per_page = 25

    search_fields = (
        'region__name',
    )


@admin.register(ContinentMarker)
class ContinentMarkerAdmin(ImportExportModelAdmin):
    resource_class = ContinentMarkerResource

    fields = (
        'continent',
        'x',
        'y',
        'map',
    )

    list_display = (
        'continent',
        'x',
        'y',
        'map',
    )

    list_filter = (
        'map',
    )

    list_per_page = 25

    search_fields = (
        'continent__name',
    )
