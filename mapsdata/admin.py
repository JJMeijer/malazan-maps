from django.contrib import admin
from django.utils.html import format_html

from .models import Book, City, Region, Continent, Map, CityMarker, RegionMarker

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
    )

    list_filter = (
        'book',
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
class CityAdmin(admin.ModelAdmin):
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
        """Counter of how much markers are defined for the Map"""
        return len(obj.city_markers.all())


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'short_name',
        'wiki_link',
        'continent',
    )

    list_display = (
        'name',
        'continent',
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
