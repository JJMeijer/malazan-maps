from django_distill import distill_path

from django.contrib.sitemaps.views import sitemap
from django.urls import path

from mapsdata.models import Map, Book, Place

from mapsdata.views import book_list_view, book_detail_view, map_list_view, map_detail_view
from mapsdata.views import home_view, place_view

from mapsdata.sitemaps import sitemaps


def distill_no_params():
    """Function for Route that needs no parameters during static
    site generation"""
    return None

def distill_maps():
    """Function that generates all possible maps parameters during static
    site generation"""
    for instance in Map.objects.all():
        yield {'map_short_name': instance.short_name}

def distill_books():
    """Function that generates all possible books parameters during static
    site generation"""
    for book in Book.objects.all():
        yield {'book_short_name': book.short_name}

def distill_places():
    """Function that generates all possible places parameters during static
    site generation"""
    for place in Place.objects.all():
        yield {'place_short_name': place.short_name}

urlpatterns = [
    distill_path(
        'maps/',
        map_list_view,
        name='map_list',
        distill_func=distill_no_params
    ),
    distill_path(
        'maps/<str:map_short_name>/',
        map_detail_view,
        name='map_detail',
        distill_func=distill_maps
    ),
    distill_path(
        'books/',
        book_list_view,
        name='book_list',
        distill_func=distill_no_params
    ),
    distill_path(
        'books/<str:book_short_name>/',
        book_detail_view,
        name='book_detail',
        distill_func=distill_books
    ),
    distill_path(
        'places/<str:place_short_name>/',
        place_view,
        name='place_detail',
        distill_func=distill_places
    ),
    distill_path(
        '',
        home_view,
        name='home',
        distill_func=distill_no_params,
        distill_file='index.html'
    ),
    path(
        'sitemap.xml',
        sitemap,
        {'sitemaps': sitemaps},
        name='django.contrib.sitemaps.views.sitemap'
    ),
]
