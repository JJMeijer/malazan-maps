from django.http import Http404
from django.shortcuts import render

from .models import Map

def map_view(request, map_id):
    """Map View that returns a Map"""
    try:
        instance = Map.objects.get(pk=map_id)
    except Map.DoesNotExist as err:
        raise Http404("Map ID does not exist") from err

    context = {
        'page_title': instance.name
    }

    return render(request, 'map.html', context)
