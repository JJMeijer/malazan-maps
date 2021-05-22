from django.urls import path

from .views import map_view, home_view, city_view, region_view

urlpatterns = [
    path('map/<str:map_short_name>/', map_view, name='map'),
    path('city/<str:city_short_name>/', city_view, name='city'),
    path('region/<str:region_short_name>/', region_view, name='region'),
    path('', home_view, name='home'),
]
