import time

from django.core.management.base import BaseCommand, CommandError
from mediawiki.exceptions import PageError

from mapsdata.models import Place, Book, Continent
from mapsdata.wikia import get_first_paragraph

class Command(BaseCommand):
    help = 'Get descriptions from the Malazan wikia for new Cities/Regions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update all existing Descriptions of Cities/Region from the Malazan wikia')

        parser.add_argument(
            'obj_names',
            nargs = '*',
            type = str,
            help = 'Name of a specific item to fetch/update'
        )

    def handle(self, *args, **options):
        is_update = options['update']

        if len(options['obj_names']) > 0:
            for obj_name in options['obj_names']:
                self.fetch_single(obj_name, is_update)

        else:
            self.fetch_all(is_update)

    def fetch_single(self, name, is_update):
        """Fetch or update description of a single object by name"""
        if Place.objects.filter(name=name).exists():
            obj = Place.objects.get(name=name)
            self.fetch_description(obj, is_update)

        if Continent.objects.filter(name=name).exists():
            obj = Continent.objects.get(name=name)
            self.fetch_description(obj, is_update)

        if Book.objects.filter(name=name).exists():
            obj = Book.objects.get(name=name)
            self.fetch_description(obj, is_update)

    def fetch_all(self, is_update):
        """Fetch or update descriptions of all items in db"""
        for place in Place.objects.all():
            self.fetch_description(place, is_update)

        for book in Book.objects.all():
            self.fetch_description(book, is_update)

        for continent in Continent.objects.all():
            self.fetch_description(continent, is_update)

    def fetch_description(self, obj, is_update):
        """Fetch description for a model instance"""
        if obj.description == '-' or is_update:
            try:
                obj.description = get_first_paragraph(obj.name)
                obj.save()
                time.sleep(1)
            except PageError as err:
                raise CommandError('No page found for "%s"' % obj.name) from err

            operation = 'updated' if is_update else 'fetched'

            self.stdout.write(
                msg = self.style.SUCCESS(
                    text= f'Successfully {operation} description for "{obj.name}"'
                )
            )
