from django.urls import path

from .views import map_view

urlpatterns = [
    path('<int:map_id>/', map_view, name='map'),
]
