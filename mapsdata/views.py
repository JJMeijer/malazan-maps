from django.http import Http404
from django.shortcuts import render

from .models import Book, Map, City, Region
from .serializers import serialize_all, RegionSerializer, CitySerializer


def home_view(request):
    """Homepage View"""
    hero_1 = Map.objects.get(short_name='seven-cities-dg')
    hero_2 = Map.objects.get(short_name='darujhistan')
    hero_3 = Map.objects.get(short_name='chain-of-dogs-1')

    context = {
        'page_title': 'Home | Malazan Maps',
        'hero_1': hero_1,
        'hero_2': hero_2,
        'hero_3': hero_3,
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
        'map_image_src': instance.image.url,
        'entries': serialize_all(),
        'markers': '{}'
    }

    return render(request, 'map.html', context)


def city_view(request, city_short_name):
    """City View"""
    try:
        instance = City.objects.get(short_name=city_short_name)
    except City.DoesNotExist as err:
        raise Http404("City is not known") from err

    markers = instance.city_markers.all()

    context = {
        'page_title': f'{instance.name} | Malazan Maps',
        'marker_name': instance.name,
        'markers': markers,
        'description': instance.description,
        'wiki_link': instance.wiki_link,
        'entries': serialize_all()
    }

    return render(request, 'marker.html', context)


def region_view(request, region_short_name):
    """Region View"""
    try:
        instance = Region.objects.get(short_name=region_short_name)
    except Region.DoesNotExist as err:
        raise Http404("Region is not known") from err

    markers = instance.region_markers.all()

    context = {
        'page_title': f'{instance.name} | Malazan Maps',
        'marker_name': instance.name,
        'markers': markers,
        'description': instance.description,
        'wiki_link': instance.wiki_link,
        'entries': serialize_all()
    }

    return render(request, 'marker.html', context)


def book_view(request, book_short_name):
    """Book View"""
    try:
        instance = Book.objects.get(short_name=book_short_name)
    except Book.DoesNotExist as err:
        raise Http404("Book is not known") from err

    cities = CitySerializer(
        instance=City.objects.filter(city_markers__map__books__short_name=book_short_name),
        many=True
    ).data

    regions = RegionSerializer(
        instance=Region.objects.filter(region_markers__map__books__short_name=book_short_name),
        many=True
    ).data

    context = {
        'book_name': instance.name,
        'description': instance.description,
        'wiki_link': instance.wiki_link,
        'cover_url': instance.cover.url,
        'cities': cities,
        'regions': regions,
        'entries': serialize_all()
    }

    return render(request, 'book.html', context)
