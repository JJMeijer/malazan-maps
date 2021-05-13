import random

from django.http import Http404
from django.shortcuts import render

from .models import Map

def map_view(request, map_short_name):
    """Map View that returns a Map"""
    try:
        instance = Map.objects.get(short_name=map_short_name)
    except Map.DoesNotExist as err:
        raise Http404("Map ID does not exist") from err

    context = {
        'page_title': instance.name,
        'map_image_src': instance.image.url
    }

    return render(request, 'map.html', context)


def home_view(request):
    """Homepage View"""
    hero_1 = Map.objects.get(short_name='seven-cities')
    hero_2 = Map.objects.get(short_name='darujhistan')
    hero_3 = Map.objects.get(short_name='chain-of-dogs-1')

    context = {
        'page_title': 'Malazan Maps | Home',
        'hero_1': hero_1,
        'hero_2': hero_2,
        'hero_3': hero_3
    }

    return render(request, 'home.html', context)
