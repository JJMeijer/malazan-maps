from django.contrib import admin


class PlaceZeroMarkerFilter(admin.SimpleListFilter):
    title = 'has markers'

    parameter_name = 'has_markers'

    def lookups(self, request, model_admin):
        return (
            ('true', 'True'),
            ('false', 'False'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'true':
            return queryset.filter(markers__isnull=False)

        if self.value() == 'false':
            return queryset.filter(markers__isnull=True)
