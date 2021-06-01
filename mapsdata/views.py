from django.http import Http404
from django.shortcuts import render

from mapsdata.models import Book, Map, Place
from mapsdata.serializers import serialize_all


def home_view(request):
    """Homepage View"""
    context = {
        'page_title': 'Home',
        'page_description': 'Malazan Maps Search Engine. Find all places mentioned in the books of the Malazan: Book of the Fallen series.',
        'header_image': Map.objects.get(short_name='darujhistan'),
        'entries': serialize_all()
    }

    return render(request, 'home.html', context)


def map_view(request, map_short_name):
    """Map View that returns a Map"""
    try:
        instance = Map.objects.get(short_name=map_short_name)
    except Map.DoesNotExist as err:
        raise Http404("Map is not known") from err

    context = {
        'page_title': instance.name,
        'page_description': f'{instance.name} Map. One of the maps in the world of Malazan: Book of the Fallen',
        'map_short_name': instance.short_name,
        'map_image_src': instance.image.url,
        'entries': serialize_all()
    }

    return render(request, 'map.html', context)


def place_view(request, place_short_name):
    """Place View"""
    try:
        instance = Place.objects.get(short_name=place_short_name)
    except Place.DoesNotExist as err:
        raise Http404("Place is not known") from err

    markers = instance.markers.all()

    context = {
        'page_title': f'{instance.name}',
        'page_description': instance.description,
        'marker_name': instance.name,
        'markers': markers,
        'description': instance.description,
        'wiki_link': instance.wiki_link,
        'entries': serialize_all()
    }

    return render(request, 'place.html', context)


def book_view(request, book_short_name):
    """Book View"""
    try:
        instance = Book.objects.get(short_name=book_short_name)
    except Book.DoesNotExist as err:
        raise Http404("Book is not known") from err

    context = {
        'page_title': f'{instance.name}',
        'page_description': f'Check out the maps that were included in the book {instance.name}',
        'book_name': instance.name,
        'book_short_name': instance.short_name,
        'description': instance.description,
        'wiki_link': instance.wiki_link,
        'cover_url': instance.cover.url,
        'maps': instance.maps.all(),
        'entries': serialize_all()
    }

    return render(request, 'book.html', context)
