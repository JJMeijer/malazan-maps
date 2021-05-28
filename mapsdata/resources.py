from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget

from mapsdata.models import Marker, Place, Continent, Map

class PlaceResource(resources.ModelResource):
    continent = fields.Field(
        column_name='continent',
        attribute='continent',
        widget=ForeignKeyWidget(Continent, 'name')
    )

    class Meta:
        model = Place

        import_id_fields = ('name',)

        skip_unchanged = True
        report_skipped = True

        fields = (
            'name',
            'short_name',
            'type',
            'wiki_link',
            'continent',
            'description',
        )

        export_order = (
            'name',
            'short_name',
            'type',
            'wiki_link',
            'continent',
            'description',
        )


class MarkerResource(resources.ModelResource):
    map = fields.Field(
        column_name='map',
        attribute='map',
        widget=ForeignKeyWidget(Map, 'short_name')
    )

    place = fields.Field(
        column_name='place',
        attribute='place',
        widget=ForeignKeyWidget(Place, 'short_name')
    )

    class Meta:
        model = Marker

        import_id_fields = ('place', 'map',)

        skip_unchanged = True
        report_skipped = True

        fields = (
            'place',
            'x',
            'y',
            'map',
        )

        export_order = (
            'place',
            'x',
            'y',
            'map',
        )
