from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Generates annotation images for the provided atlases'

    def add_arguments(self, parser):
        parser.add_argument('atlases_ids', nargs='+', type=int)

    def handle(self, *args, **options):
        for atlas_id in options['atlases_ids']:
            try:
                print(atlas_id)
            except Exception:
                raise CommandError('Something went wrong')
        self.stdout.write(self.style.SUCCESS('Successfully generated plots'))
