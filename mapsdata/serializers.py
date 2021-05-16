from rest_framework import serializers

from .models import CityMarker, City, Map, Region, RegionMarker


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = (
            'name',
            'wiki_link',
        )


class CityMarkerSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = CityMarker
        fields = (
            'x',
            'y',
            'city'
        )


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = (
            'name',
            'wiki_link',
        )


class RegionMarkerSerializer(serializers.ModelSerializer):
    region = RegionSerializer()

    class Meta:
        model = RegionMarker
        fields = (
            'x',
            'y',
            'region'
        )


class MapSerializer(serializers.ModelSerializer):
    city_markers = CityMarkerSerializer(many=True)
    region_markers =RegionMarkerSerializer(many=True)

    class Meta:
        model = Map
        fields = (
            'city_markers',
            'region_markers',
        )
