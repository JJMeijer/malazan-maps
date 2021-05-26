from django.contrib import admin


class RegionZeroMarkerFilter(admin.SimpleListFilter):
    title = 'has markers'

    parameter_name = 'has_markers'

    def lookups(self, request, model_admin):
        return (
            ('true', 'True'),
            ('false', 'False'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'true':
            return queryset.filter(region_markers__isnull=False)

        if self.value() == 'false':
            return queryset.filter(region_markers__isnull=True)


class CityZeroMarkerFilter(admin.SimpleListFilter):
    title = 'has markers'

    parameter_name = 'has_markers'

    def lookups(self, request, model_admin):
        return (
            ('true', 'True'),
            ('false', 'False'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'true':
            return queryset.filter(city_markers__isnull=False)

        if self.value() == 'false':
            return queryset.filter(city_markers__isnull=True)
