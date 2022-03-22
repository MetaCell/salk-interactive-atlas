import csv

from cloudharness import log

from api.models import Experiment, Tag, Population

class ExperimentService:
    @staticmethod
    def add_tag(experiment: Experiment, tag_name: str):
        try:
            tag = experiment.tags.get(name=tag_name)
        except Tag.DoesNotExist:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            experiment.tags.add(tag)
            experiment.save()

        return tag

    @staticmethod
    def delete_tag(experiment: Experiment, tag_name: str):
        try:
            tag = experiment.tags.get(name=tag_name)
            experiment.tags.remove(tag)
            experiment.save()
        except Tag.DoesNotExist:
            pass
        return True

    @staticmethod
    def upload_file(experiment: Experiment, population_name: str, file):
        population, created = Population.objects.get_or_create(experiment_id=experiment.id, name=population_name)
        population.save()
        # delete all cells
        #
        with open(file.file.name) as csvfile:
            reader = csv.reader(csvfile)
            batch_size = 50000
            cells = []
        pass
