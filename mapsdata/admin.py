from django.contrib import admin
from django.utils.html import format_html

from import_export.admin import ImportExportModelAdmin

from .models import Book, City, Region, Continent, Map, CityMarker, RegionMarker
from .resources import CityMarkerResource, CityResource, RegionResource, RegionMarkerResource

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


class CityMarkersInlineMaps(admin.TabularInline):
    model = CityMarker

    fields = (
        'x',
        'y',
        'city',
    )

    extra = 1


class RegionMarkersInlineMaps(admin.TabularInline):
    model = RegionMarker

    fields = (
        'x',
        'y',
        'region',
    )

    extra = 1


class CityMarkersInlineCities(admin.TabularInline):
    model = CityMarker

    fields = (
        'x',
        'y',
        'map',
    )

    extra = 1

class RegionMarkersInlineRegions(admin.TabularInline):
    model = RegionMarker

    fields = (
        'x',
        'y',
        'map',
    )

    extra = 1


@admin.register(Map)
class MapAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'short_name',
        'image',
        'width',
        'height',
        'book',
        'map_image',
    )

    readonly_fields = (
        'width',
        'height',
        'map_image',
    )

    list_display = (
        'name',
        'book',
        'map_image',
        'width',
        'height',
        'marker_counter',
        'updated',
    )

    list_filter = (
        'book',
    )

    ordering = (
        '-updated',
    )

    list_per_page = 20

    def map_image(self, obj):
        """Generates HTML to display the Image of the Map"""
        if obj.image:
            return format_html(
                '<img href="{0}" src="{0}" width="150" height="150" style="object-fit: contain;" />',
                obj.image.url
            )
        else:
            return format_html('<p>-</p>')

    @admin.display(description='markers')
    def marker_counter(self, obj):
        """Counter of how much markers are defined for the Map"""
        return len(obj.city_markers.all()) + len(obj.region_markers.all())

    inlines = (CityMarkersInlineMaps, RegionMarkersInlineMaps,)


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

    inlines = (CityMarkersInlineCities,)

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

    inlines = (
        RegionMarkersInlineRegions,
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
