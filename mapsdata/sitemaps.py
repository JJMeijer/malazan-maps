from datetime import datetime

from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from mapsdata.models import Book, Place, Continent

class BookSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.5
    protocol = 'https'

    def items(self):
        """Get Items to include in the sitemap"""
        return Book.objects.all()

    @staticmethod
    def lastmod(obj):
        """Set Field which functions as the lastmod date field"""
        return obj.updated

    @staticmethod
    def location(item):
        """Generate URL Paths of items"""
        return f'/books/{item.short_name}/'


class ContinentSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.5
    protocol = 'https'

    def items(self):
        """Get Items to include in the sitemap"""
        return Continent.objects.all()

    @staticmethod
    def lastmod(obj):
        """Set Field which functions as the lastmod date field"""
        return obj.updated

    @staticmethod
    def location(item):
        """Generate URL Paths of items"""
        return f'/continents/{item.short_name}/'


class PlaceSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.6
    protocol = 'https'

    def items(self):
        """Get Items to include in the sitemap"""
        return Place.objects.all()

    @staticmethod
    def lastmod(obj):
        """Set Field which functions as the lastmod date field"""
        return obj.updated

    @staticmethod
    def location(item):
        """Generate URL Paths of items"""
        return f'/places/{item.short_name}/'


class StaticSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.5
    protocol = 'https'

    def items(self):
        """Get Items to include in the sitemap"""
        return (
            'home',
        )

    @staticmethod
    def lastmod(_obj):
        """Set last updated date to the time that the sitemap was generated"""
        return datetime.now()

    @staticmethod
    def location(item):
        """Generate URL Paths of items"""
        return reverse(item)


sitemaps = {
    'static': StaticSitemap,
    'books': BookSitemap,
    'places': PlaceSitemap,
    'continents': ContinentSitemap
}
