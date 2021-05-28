from rest_framework import serializers

from mapsdata.models import Book, Place, Marker


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
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

    places = PlaceSerializer(
        instance=Place.objects.all(),
        many=True
    ).data

    return books + places


class PlaceForMarkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = (
            'name',
            'short_name',
            'description',
        )


class MarkerSerializer(serializers.ModelSerializer):
    place = PlaceForMarkerSerializer()

    class Meta:
        model = Marker
        fields = (
            'place',
            'x',
            'y',
        )
