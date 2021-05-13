from django.contrib import admin
from django.utils.html import format_html

from .models import Book, City, Region, Continent, Map, CityPointer, RegionPointer


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    fields = (
        'title',
        'cover',
        'wiki_link',
    )

    list_display = (
        'title',
        'cover_image',
    )

    def cover_image(self, obj):
        """Generates HTML that displays the cover image of the Book"""
        return format_html(
            '<img href="{0}" src="{0}" width="150" height="150" style="object-fit: contain;" />',
            obj.cover.url
        )


class CityPointersInlineMaps(admin.TabularInline):
    model = CityPointer

    fields = (
        'x',
        'y',
        'city',
    )

    extra = 1


class RegionPointersInlineMaps(admin.TabularInline):
    model = RegionPointer

    fields = (
        'x',
        'y',
        'region',
    )

    extra = 1


class CityPointersInlineCities(admin.TabularInline):
    model = CityPointer

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
    )

    list_filter = (
        'book',
    )

    def map_image(self, obj):
        """Generates HTML to display the Image of the Map"""
        if obj.image:
            return format_html(
                '<img href="{0}" src="{0}" width="150" height="150" style="object-fit: contain;" />',
                obj.image.url
            )
        else:
            return format_html('<p>-</p>')

    inlines = (CityPointersInlineMaps, RegionPointersInlineMaps,)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'wiki_link',
        'continent',
    )

    list_display = (
        'name',
        'continent',
    )

    list_filter = (
        'continent',
    )

    inlines = (CityPointersInlineCities,)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    fields = (
        'name',
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
        'wiki_link',
    )

    list_display = (
        'name',
    )
