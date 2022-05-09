from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Generates plots (heatmap and centroids) for each population provided'

    def add_arguments(self, parser):
        parser.add_argument('population_ids', nargs='+', type=int)

    def handle(self, *args, **options):
        for pop_id in options['population_ids']:
            try:
                print(pop_id)
            except Exception:
                raise CommandError('Something went wrong')
        self.stdout.write(self.style.SUCCESS('Successfully generated plots'))
