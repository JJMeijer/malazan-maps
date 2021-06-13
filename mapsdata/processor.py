from django.conf import settings

from mapsdata.serializers import serialize_all

def common_context(request):
    """Common Context that should be used in all views"""
    return {
        "debug_flag": settings.DEBUG,
        "entries": serialize_all()
    }
