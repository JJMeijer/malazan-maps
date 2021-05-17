import time

from django.core.management.base import BaseCommand, CommandError
from mediawiki.exceptions import PageError

from mapsdata.models import City
from mapsdata.wikia import get_first_paragraph

class Command(BaseCommand):
    help = 'Get descriptions from the Malazan wikia for new Cities/Regions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update all existing Descriptions of Cities/Region from the Malazan wikia')

    def handle(self, *args, **options):
        for city in City.objects.all():
            if city.description == '-' or options['update']:
                try:
                    city.description = get_first_paragraph(city.name)
                    city.save()
                    time.sleep(1)
                except PageError as err:
                    raise CommandError('No page found for "%s"' % city.name) from err

                operation = 'updated' if options['update'] else 'fetched'

                self.stdout.write(
                    msg = self.style.SUCCESS(
                        text= f'Successfully {operation} description for "{city.name}"'
                    )
                )
