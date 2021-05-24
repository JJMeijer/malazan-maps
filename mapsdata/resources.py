from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget

from mapsdata.models import City, Continent, CityMarker, Map, Region, RegionMarker, ContinentMarker

class CityResource(resources.ModelResource):
    continent = fields.Field(
        column_name='continent',
        attribute='continent',
        widget=ForeignKeyWidget(Continent, 'name')
    )

    class Meta:
        model = City

        import_id_fields = ('name',)

        skip_unchanged = True
        report_skipped = True

        fields = (
            'name',
            'short_name',
            'wiki_link',
            'continent',
        )

        export_order = (
            'name',
            'short_name',
            'wiki_link',
            'continent',
        )


class RegionResource(resources.ModelResource):
    continent = fields.Field(
        column_name='continent',
        attribute='continent',
        widget=ForeignKeyWidget(Continent, 'name')
    )

    class Meta:
        model = Region

        import_id_fields = ('name',)

        skip_unchanged = True
        report_skipped = True

        fields = (
            'name',
            'short_name',
            'wiki_link',
            'continent',
        )

        export_order = (
            'name',
            'short_name',
            'wiki_link',
            'continent',
        )


class CityMarkerResource(resources.ModelResource):
    map = fields.Field(
        column_name='map',
        attribute='map',
        widget=ForeignKeyWidget(Map, 'short_name')
    )

    city = fields.Field(
        column_name='city',
        attribute='city',
        widget=ForeignKeyWidget(City, 'short_name')
    )

    class Meta:
        model = CityMarker

        import_id_fields = ('city', 'map',)

        skip_unchanged = True
        report_skipped = True

        fields = (
            'city',
            'x',
            'y',
            'map',
        )

        export_order = (
            'city',
            'x',
            'y',
            'map',
        )


class RegionMarkerResource(resources.ModelResource):
    map = fields.Field(
        column_name='map',
        attribute='map',
        widget=ForeignKeyWidget(Map, 'short_name')
    )

    region = fields.Field(
        column_name='region',
        attribute='region',
        widget=ForeignKeyWidget(Region, 'short_name')
    )

    class Meta:
        model = RegionMarker

        import_id_fields = ('region', 'map',)

        skip_unchanged = True
        report_skipped = True

        fields = (
            'region',
            'x',
            'y',
            'map',
        )

        export_order = (
            'region',
            'x',
            'y',
            'map',
        )

class ContinentMarkerResource(resources.ModelResource):
    map = fields.Field(
        column_name='map',
        attribute='map',
        widget=ForeignKeyWidget(Map, 'short_name')
    )

    continent = fields.Field(
        column_name='continent',
        attribute='continent',
        widget=ForeignKeyWidget(Continent, 'short_name')
    )

    class Meta:
        model = ContinentMarker

        import_id_fields = ('continent', 'map',)

        skip_unchanged = True
        report_skipped = True

        fields = (
            'continent',
            'x',
            'y',
            'map',
        )

        export_order = (
            'continent',
            'x',
            'y',
            'map',
        )
