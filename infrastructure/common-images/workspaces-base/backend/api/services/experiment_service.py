from api.models import Experiment, Population, Tag


def add_tag(experiment: Experiment, tag_name: str):
    try:
        tag = experiment.tags.get(name=tag_name)
    except Tag.DoesNotExist:
        tag, created = Tag.objects.get_or_create(name=tag_name)
        experiment.tags.add(tag)
        experiment.save()

    return tag


def delete_tag(experiment: Experiment, tag_name: str):
    try:
        tag = experiment.tags.get(name=tag_name)
        experiment.tags.remove(tag)
        experiment.save()
    except Tag.DoesNotExist:
        pass
    return True


def upload_file(experiment: Experiment, population_name: str, file):
    population, created = Population.objects.get_or_create(
        experiment_id=experiment.id, name=population_name
    )
    if not created:
        population.remove_split_cells_csv()
    population.cells = file
    population.save()
    return created
