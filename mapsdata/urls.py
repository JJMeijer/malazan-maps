from django.urls import path

from .views import map_view, home_view

urlpatterns = [
    path('maps/<str:map_short_name>/', map_view, name='maps'),
    path('', home_view, name='home'),
]
