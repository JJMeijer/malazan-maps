from rest_framework import serializers

from .models import Book, City, Region, Continent


class CitySerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    @staticmethod
    def get_type(_obj):
        """Static method to add type to serialized objects"""
        return 'city'

    class Meta:
        model = City
        fields = (
            'name',
            'short_name',
            'type',
        )


class RegionSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    @staticmethod
    def get_type(_obj):
        """Static method to add type to serialized objects"""
        return 'region'

    class Meta:
        model = Region
        fields = (
            'name',
            'short_name',
            'type',
        )


class ContinentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    @staticmethod
    def get_type(_obj):
        """Static method to add type to serialized objects"""
        return 'continent'

    class Meta:
        model = Continent
        fields = (
            'name',
            'short_name',
            'type',
        )


class BookSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    @staticmethod
    def get_type(_obj):
        """Static method to add type to serialized objects"""
        return 'book'

    class Meta:
        model = Book
        fields = (
            'name',
            'short_name',
            'type',
        )


def serialize_all():
    """Serialize all Cities, Regions, Continens & Books in the Database as JSON"""
    books = BookSerializer(
        instance=Book.objects.all(),
        many=True
    ).data

    cities = CitySerializer(
        instance=City.objects.all(),
        many=True
    ).data

    regions = RegionSerializer(
        instance=Region.objects.all(),
        many=True
    ).data

    continents = ContinentSerializer(
        instance=Continent.objects.all(),
        many=True
    ).data

    return cities + regions + books + continents
