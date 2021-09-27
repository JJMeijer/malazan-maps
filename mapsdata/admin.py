from django.db import models
from django.contrib import admin, messages
from django.utils.html import format_html
from django.forms import CheckboxSelectMultiple
from django.db.models.aggregates import Count
from django.utils.translation import ngettext

from mediawiki.exceptions import PageError

from mapsdata.models import Book, Place, Marker, Continent, Map
from mapsdata.filters import PlaceHasDescriptionFilter, PlaceHasMarkerFilter
from mapsdata.wikia import get_first_paragraph

admin.site.enable_nav_sidebar = False

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'short_name',
        'cover',
        'wiki_link',
        'description',
        'cover_image',
    )

    readonly_fields = (
        'description',
        'cover_image',
    )

    list_display = (
        'name',
        'cover_image',
        'description',
    )

    @staticmethod
    def cover_image(obj):
        """Generates HTML that displays the cover image of the Book"""
        return format_html(
            '<img href="{0}" src="{0}" width="150" height="150" style="object-fit: contain;" />',
            obj.cover.url
        )

    @admin.action(description="Fetch wiki description")
    def fetch_description_action(self, request, queryset):
        """Django admin action to retrieve wiki description for an item"""
        number_of_items = queryset.count()

        for item in queryset:
            try:
                item.description = get_first_paragraph(item.name)
                item.save()
            except PageError:
                self.message_user(
                    request,
                    f'Error occurred while retrieving description for {item.name}',
                    messages.ERROR
                )

        self.message_user(
            request,
            ngettext(
                f'{number_of_items} description was updated',
                f'{number_of_items} descriptions were updated',
                number_of_items,
            ),
            messages.SUCCESS
        )

    actions = (
        fetch_description_action,
    )

    class Media:
        css = { "all" : ("css/admin/hide-admin-original.css",) }


@admin.register(Map)
class MapAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'short_name',
        'continent',
        'image',
        'books',
        'priority',
        'map_image',
    )

    readonly_fields = (
        'map_image',
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

    @staticmethod
    @admin.display(description='books')
    def get_books(obj):
        """Get related books as newline-seperated string"""
        return ", ".join([book.name for book in obj.books.all()])

    @staticmethod
    @admin.display(ordering='marker_count', description='markers')
    def marker_count(obj):
        """Counter of how much markers are defined for the Map"""
        return obj.marker_count

    formfield_overrides = {
        models.ManyToManyField: {'widget': CheckboxSelectMultiple},
    }

    @staticmethod
    @admin.display(description='map_image')
    def map_image(instance):
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
                </div>
            </div>
            """,
            instance.image.url
        )


class PlaceMarkersInline(admin.TabularInline):
    model = Marker
    extra = 1

    fields = (
        'map',
        'x',
        'y',
    )


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
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
        'description',
    )

    list_filter = (
        'continent',
        'type',
        PlaceHasMarkerFilter,
        PlaceHasDescriptionFilter,
    )

    save_as = True

    list_per_page = 25

    search_fields = (
        'name',
    )

    inlines = (
        PlaceMarkersInline,
    )

    @admin.action(description="Fetch wiki description")
    def fetch_description_action(self, request, queryset):
        """Django admin action to retrieve wiki description for an item"""
        number_of_items = queryset.count()

        for item in queryset:
            try:
                item.description = get_first_paragraph(item.name)
                item.save()
            except PageError:
                self.message_user(
                    request,
                    f'Error occurred while retrieving description for {item.name}',
                    messages.ERROR
                )

        self.message_user(
            request,
            ngettext(
                f'{number_of_items} description was updated',
                f'{number_of_items} descriptions were updated',
                number_of_items,
            ),
            messages.SUCCESS
        )

    actions = (
        fetch_description_action,
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.annotate(marker_count=Count('markers'))
        return qs

    @staticmethod
    @admin.display(ordering='marker_count', description='markers')
    def marker_count(obj):
        """Counter of how much markers are defined for the Place"""
        return len(obj.markers.all())

    class Media:
        css = { "all" : ("css/admin/hide-admin-original.css",) }


@admin.register(Continent)
class ContinentAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'short_name',
        'wiki_link',
        'description',
    )

    readonly_fields = (
        'description',
    )

    list_display = (
        'name',
        'description',
        'updated',
    )

    @admin.action(description="Fetch wiki description")
    def fetch_description_action(self, request, queryset):
        """Django admin action to retrieve wiki description for an item"""
        number_of_items = queryset.count()

        for item in queryset:
            try:
                item.description = get_first_paragraph(item.name)
                item.save()
            except PageError:
                self.message_user(
                    request,
                    f'Error occurred while retrieving description for {item.name}',
                    messages.ERROR
                )

        self.message_user(
            request,
            ngettext(
                f'{number_of_items} description was updated',
                f'{number_of_items} descriptions were updated',
                number_of_items,
            ),
            messages.SUCCESS
        )

    actions = (
        fetch_description_action,
    )

    class Media:
        css = { "all" : ("css/admin/hide-admin-original.css",) }


@admin.register(Marker)
class MarkerAdmin(admin.ModelAdmin):
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

    @staticmethod
    @admin.display(description='type')
    def get_type(instance):
        """Get Type of the related place"""
        return instance.place.type

    @staticmethod
    @admin.display(description='marker')
    def marker(instance):
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
