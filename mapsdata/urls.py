from django.urls import path

from .views import book_view, map_view, home_view, place_view

urlpatterns = [
    path('map/<str:map_short_name>/', map_view, name='map'),
    path('place/<str:place_short_name>/', place_view, name='place'),
    path('book/<str:book_short_name>/', book_view, name='book'),
    path('', home_view, name='home'),
]
