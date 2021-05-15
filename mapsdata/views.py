import json

from django.http import Http404
from django.shortcuts import render

from .models import Map, City
from .serializers import MapSerializer

def map_view(request, map_short_name):
    """Map View that returns a Map"""
    try:
        instance = Map.objects.get(short_name=map_short_name)
    except Map.DoesNotExist as err:
        raise Http404("Map is not known") from err

    pointers_json = json.dumps(MapSerializer(instance).data)

    context = {
        'page_title': instance.name,
        'map_image_src': instance.image.url,
        'pointers': pointers_json
    }

    return render(request, 'map.html', context)


def city_view(request, city_short_name):
    """City View"""
    try:
        instance = City.objects.get(short_name=city_short_name)
    except City.DoesNotExist as err:
        raise Http404("City is not known") from err

    pointers = instance.city_pointers.all()

    context = {
        'page_title': f'Malazan Maps | {instance.name}',
        'city_name': instance.name,
        'pointers': pointers
    }

    return render(request, 'city.html', context)


def home_view(request):
    """Homepage View"""
    hero_1 = Map.objects.get(short_name='seven-cities-dg')
    hero_2 = Map.objects.get(short_name='darujhistan')
    hero_3 = Map.objects.get(short_name='chain-of-dogs-1')

    context = {
        'page_title': 'Malazan Maps | Home',
        'hero_1': hero_1,
        'hero_2': hero_2,
        'hero_3': hero_3
    }

    return render(request, 'home.html', context)
