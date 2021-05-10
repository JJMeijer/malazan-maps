from django.contrib import admin
from django.utils.html import format_html

from .models import Book, City, Region, Continent, Map


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


@admin.register(Map)
class MapAdmin(admin.ModelAdmin):
    fields = (
        'name',
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


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    pass


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    pass


@admin.register(Continent)
class ContinentAdmin(admin.ModelAdmin):
    pass
