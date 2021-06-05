from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from mapsdata.models import Book, Place, Map

class BookSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.5
    protocol = 'https'

    def items(self):
        """Get Items to include in the sitemap"""
        return Book.objects.all()

    def lastmod(self, obj):
        """Set Field which functions as the lastmod date field"""
        return obj.updated

    def location(self, item):
        """Generate URL Paths of items"""
        return f'/books/{item.short_name}'


class MapSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.5
    protocol = 'https'

    def items(self):
        """Get Items to include in the sitemap"""
        return Map.objects.all()

    def lastmod(self, obj):
        """Set Field which functions as the lastmod date field"""
        return obj.updated

    def location(self, item):
        """Generate URL Paths of items"""
        return f'/maps/{item.short_name}'


class PlaceSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.6
    protocol = 'https'

    def items(self):
        """Get Items to include in the sitemap"""
        return Place.objects.all()

    def lastmod(self, obj):
        """Set Field which functions as the lastmod date field"""
        return obj.updated

    def location(self, item):
        """Generate URL Paths of items"""
        return f'/places/{item.short_name}'


class StaticSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.5
    protocol = 'https'

    def items(self):
        """Get Items to include in the sitemap"""
        return (
            'home',
        )

    def location(self, item):
        """Generate URL Paths of items"""
        return reverse(item)


sitemaps = {
    'static': StaticSitemap,
    'books': BookSitemap,
    'places': PlaceSitemap,
    'maps': MapSitemap
}
