from django.contrib import admin
from django.db.models.functions import Length

class PlaceHasMarkerFilter(admin.SimpleListFilter):
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

        return None


class PlaceHasDescriptionFilter(admin.SimpleListFilter):
    title = 'has description'

    parameter_name = 'has_description'

    def lookups(self, request, model_admin):
        return (
            ('true', 'True'),
            ('false', 'False'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'true':
            return queryset.annotate(desc_len=Length('description')).filter(desc_len__gte=2)

        if self.value() == 'false':
            return queryset.annotate(desc_len=Length('description')).filter(desc_len__lt=2)

        return None
