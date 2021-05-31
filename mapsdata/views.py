from django.http import Http404
from django.shortcuts import render

from mapsdata.models import Book, Map, Place
from mapsdata.serializers import serialize_all


def home_view(request):
    """Homepage View"""
    hero_1 = Map.objects.get(short_name='seven-cities-dg')
    hero_2 = Map.objects.get(short_name='darujhistan')
    hero_3 = Map.objects.get(short_name='chain-of-dogs-1')

    context = {
        'page_title': 'Home',
        'page_description': 'Malazan Maps Search Engine. Find all places mentioned in the books of the Malazan: Book of the Fallen series.',
        'hero_1': hero_1,
        'hero_2': hero_2,
        'hero_3': hero_3,
        'entries': serialize_all()
    }

    return render(request, 'home.html', context)


def map_list_view(request):
    """Map List View that lists all Maps"""
    maps = Map.objects.all()

    context = {
        'page_title': 'Maps',
        'page_description': 'Find all maps of the world of Malazan: Book of the Fallen',
        'entries': serialize_all(),
        'maps': maps
    }

    return render(request, 'map_list.html', context)

def map_detail_view(request, map_short_name):
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

    return render(request, 'map_detail.html', context)


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

    return render(request, 'marker.html', context)

def book_list_view(request):
    """Book List View"""
    books = Book.objects.all()

    context = {
        'page_title': 'Books',
        'page_description': 'All books that take place in the world of Malazan: Book of the Fallen',
        'books': books,
        'entries': serialize_all()
    }

    return render(request, 'book_list.html', context)


def book_detail_view(request, book_short_name):
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

    return render(request, 'book_detail.html', context)
