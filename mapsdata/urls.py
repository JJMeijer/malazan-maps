from django_distill import distill_path

from django.contrib.sitemaps.views import sitemap

from mapsdata.models import Continent, Book, Place
from mapsdata.views import continent_view, home_view, place_view, book_view
from mapsdata.sitemaps import sitemaps


def distill_no_params():
    """Function for Route that needs no parameters during static
    site generation"""
    return None

def distill_books():
    """Function that generates all possible books parameters during static
    site generation"""
    for book in Book.objects.all():
        yield {'book_short_name': book.short_name}

def distill_continents():
    """Function that generates all possible continent parameters during static
    site generation"""
    for continent in Continent.objects.all():
        yield {'continent_short_name': continent.short_name}

def distill_places():
    """Function that generates all possible places parameters during static
    site generation"""
    for place in Place.objects.all():
        yield {'place_short_name': place.short_name}

def distill_sitemap():
    """Function that generates all possible sitemap URLs parameters during static
    site generation"""
    yield {'sitemaps': sitemaps}

urlpatterns = [
    distill_path(
        'books/<str:book_short_name>/',
        book_view,
        name='book',
        distill_func=distill_books
    ),
    distill_path(
        'continents/<str:continent_short_name>/',
        continent_view,
        name='continent',
        distill_func=distill_continents
    ),
    distill_path(
        'places/<str:place_short_name>/',
        place_view,
        name='place',
        distill_func=distill_places
    ),
    distill_path(
        '',
        home_view,
        name='home',
        distill_func=distill_no_params,
        distill_file='index.html'
    ),
    distill_path(
        'sitemap.xml',
        sitemap,
        {'sitemaps': sitemaps},
        name='django.contrib.sitemaps.views.sitemap',
        distill_func=distill_sitemap
    ),
]
