from django.urls import path

from .views import book_view, map_view, home_view, city_view, region_view, continent_view

urlpatterns = [
    path('map/<str:map_short_name>/', map_view, name='map'),
    path('city/<str:city_short_name>/', city_view, name='city'),
    path('region/<str:region_short_name>/', region_view, name='region'),
    path('book/<str:book_short_name>/', book_view, name='book'),
    path('continent/<str:continent_short_name>/', continent_view, name='continent'),
    path('', home_view, name='home'),
]
