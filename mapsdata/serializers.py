from rest_framework import serializers

from .models import CityPointer, City, Map, Region, RegionPointer


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = (
            'name',
            'wiki_link',
        )


class CityPointerSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = CityPointer
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


class RegionPointerSerializer(serializers.ModelSerializer):
    region = RegionSerializer()

    class Meta:
        model = RegionPointer
        fields = (
            'x',
            'y',
            'region'
        )


class MapSerializer(serializers.ModelSerializer):
    city_pointers = CityPointerSerializer(many=True)
    region_pointers =RegionPointerSerializer(many=True)

    class Meta:
        model = Map
        fields = (
            'city_pointers',
            'region_pointers',
        )
