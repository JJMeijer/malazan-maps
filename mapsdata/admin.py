from django.db import models
from django.contrib import admin
from django.utils.html import format_html
from django.forms import CheckboxSelectMultiple
from django.db.models.aggregates import Count

from import_export.admin import ImportExportModelAdmin

from mapsdata.models import Book, Place, Marker, Continent, Map
from mapsdata.resources import PlaceResource, MarkerResource
from mapsdata.filters import PlaceHasDescriptionFilter, PlaceHasMarkerFilter

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
        'thumbnail',
        'books',
        'priority',
    )

    list_display = (
        'name',
        'continent',
        'get_books',
        'marker_count',
        'priority',
        'updated',
    )

    list_filter = (
        'books',
        'continent',
    )

    ordering = (
        'name',
    )

    list_per_page = 20

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.annotate(marker_count=Count('markers'))
        return qs

    @admin.display(description='books')
    def get_books(self, obj):
        """Get related books as newline-seperated string"""
        return ", ".join([book.name for book in obj.books.all()])

    @admin.display(ordering='marker_count', description='markers')
    def marker_count(self, obj):
        """Counter of how much markers are defined for the Map"""
        return obj.marker_count

    formfield_overrides = {
        models.ManyToManyField: {'widget': CheckboxSelectMultiple},
    }


class PlaceMarkersInline(admin.TabularInline):
    model = Marker
    extra = 1

    fields = (
        'map',
        'x',
        'y',
    )


@admin.register(Place)
class PlaceAdmin(ImportExportModelAdmin):
    resource_class = PlaceResource

    fields = (
        'name',
        'short_name',
        'wiki_link',
        'continent',
        'type',
        'description',
    )

    readonly_fields = (
        'description',
    )

    list_display = (
        'name',
        'type',
        'continent',
        'marker_count',
    )

    list_filter = (
        'continent',
        'type',
        PlaceHasMarkerFilter,
        PlaceHasDescriptionFilter,
    )

    save_as = True

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.annotate(marker_count=Count('markers'))
        return qs

    @admin.display(ordering='marker_count', description='markers')
    def marker_count(self, obj):
        """Counter of how much markers are defined for the Place"""
        return len(obj.markers.all())

    list_per_page = 25

    search_fields = (
        'name',
    )

    inlines = (
        PlaceMarkersInline,
    )

    class Media:
        css = { "all" : ("css/admin/hide-admin-original.css",) }


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
        'marker',
    )

    readonly_fields = (
        'marker',
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

    class Media:
        js = (
            "js/admin/marker.js",
        )

    @admin.display(description='type')
    def get_type(self, instance):
        """Get Type of the related place"""
        return instance.place.type

    @admin.display(description='marker')
    def marker(self, instance):
        """Generates HTML that displays the Marker on the map"""
        return format_html(
            """
            <div style="width: 100%; display: flex; justify-content: center;">
                <div style="width: 65%; position: relative;">
                    <img
                        id="map-image"
                        href="{0}"
                        src="{0}"
                        style="width: 100%; object-fit: contain;"
                    />
                    <img
                        src="/static/img/marker-1.png"
                        id="map-marker"
                        style="
                            position: absolute;
                            width: 1.25rem;
                            height: 1.25rem;
                            object-fit: contain;
                            opacity: 0;
                        "
                        data-markerx={1}
                        data-markery={2}
                    />
                </div>
            </div>
            """,
            instance.map.image.url,
            instance.x,
            instance.y
        )
