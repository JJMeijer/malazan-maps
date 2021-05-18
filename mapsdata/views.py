from django.http import Http404
from django.shortcuts import render

from .models import Map, City
from .serializers import serialize_all


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
        'city_name': instance.name,
        'markers': markers,
        'description': instance.description,
        'wiki_link': instance.wiki_link,
        'entries': serialize_all()
    }

    return render(request, 'city.html', context)


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
