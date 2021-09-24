from django.http import Http404
from django.shortcuts import render

from mapsdata.models import Book, Continent, Map, Place


def home_view(request):
    """Homepage View"""
    context = {
        'page_title': 'Home',
        'page_description': 'Malazan Maps Search Engine. Find all places mentioned in the books of the Malazan: Book of the Fallen series.',
        'description': 'Find places in the world of Malazan: Book of the Fallen.'
    }

    return render(request, 'home.html', context)


def map_view(request, map_short_name):
    """Map View that returns a Map"""
    try:
        instance = Map.objects.get(short_name=map_short_name)
    except Map.DoesNotExist as err:
        raise Http404("Map is not known") from err

    maps = [{ 'map': instance}]

    context = {
        'page_title': instance.name,
        'page_description': f'{instance.name} Map. Find places on the maps in the world of Malazan: Book of the Fallen',
        'maps': maps
    }

    return render(request, 'map.html', context)


def place_view(request, place_short_name):
    """Place View"""
    try:
        instance = Place.objects.get(short_name=place_short_name)
    except Place.DoesNotExist as err:
        raise Http404("Place is not known") from err

    maps = [
        {
            'map': marker.map,
            'marker': {
                'x': marker.x,
                'y': marker.y
            }
        } for marker in instance.markers.all()]

    context = {
        'page_title': f'{instance.name}',
        'page_description': instance.description,
        'maps': maps,
        'description': instance.description,
    }

    return render(request, 'map.html', context)


def book_view(request, book_short_name):
    """Book View"""
    try:
        instance = Book.objects.get(short_name=book_short_name)
    except Book.DoesNotExist as err:
        raise Http404("Book is not known") from err

    maps = [{ 'map': map } for map in instance.maps.all()]

    context = {
        'page_title': f'{instance.name}',
        'page_description': f'Check out the maps that were included in the book {instance.name} and find other places on the maps in the world of Malazan: Book of the Fallen',
        'description': instance.description,
        'maps': maps
    }

    return render(request, 'map.html', context)


def continent_view(request, continent_short_name):
    """Continent View"""
    try:
        instance = Continent.objects.get(short_name=continent_short_name)
    except Continent.DoesNotExist as err:
        raise Http404("Continent is not known") from err

    maps = [{ 'map': map } for map in instance.maps.all()]

    context = {
        'page_title': f'{instance.name}',
        'page_description': instance.description,
        'description': instance.description,
        'maps': maps
    }

    return render(request, 'map.html', context)
