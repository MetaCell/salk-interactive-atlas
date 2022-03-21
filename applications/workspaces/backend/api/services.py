from api.models import Experiment, Tag

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
    def upload_file(experiment: Experiment):
        # Code to handle file
        # has permission_classes
        # save file
        # process file
        pass
