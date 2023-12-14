import csv
import io

from django.core.files.uploadedfile import TemporaryUploadedFile

from api.helpers.exceptions import InvalidPopulationFile, DuplicatedPopulationError, InvalidInputError
from api.models import Population
from api.services.cordmap_service import is_a_population_multiple_files, is_a_population_single_file, \
    SINGLE_FILE_POPULATION_ID_COLUMN, MULTIPLE_FILE_POPULATION_NAME_COLUMN


def process_multiple_files_row(row):
    return row[MULTIPLE_FILE_POPULATION_NAME_COLUMN] if is_a_population_multiple_files(row) else None


def process_singlefile_row(row):
    return row[SINGLE_FILE_POPULATION_ID_COLUMN] if is_a_population_single_file(row) else None


def specific_multiple_files_validation():
    object_names = set()

    def inner_validation(row):
        object_name = row[MULTIPLE_FILE_POPULATION_NAME_COLUMN]
        if object_name in object_names:
            raise InvalidPopulationFile(object_name)
        object_names.add(object_name)

    return inner_validation


def validate_population_data(csv_reader, experiment_id, row_processor, additional_validation=lambda row: True):
    for row in csv_reader:
        name = row_processor(row)

        if name is None:
            continue

        # Perform any specific validation checks
        additional_validation(row)

        # Check for duplicate experiment_id and name pair in the database
        if Population.objects.filter(experiment_id=experiment_id, name=name).exists():
            raise DuplicatedPopulationError(name)
    return True


def validate_multiple_files_input(key_file: TemporaryUploadedFile, data_file: TemporaryUploadedFile,
                                  experiment_id: int):
    if key_file is None or data_file is None:
        raise InvalidInputError

    content = key_file.read().decode('utf-8-sig')
    file = io.StringIO(content)
    csv_reader = csv.DictReader(file)
    specific_validation = specific_multiple_files_validation()
    return validate_population_data(csv_reader, experiment_id, process_multiple_files_row,
                                    specific_validation)


def validate_single_file_input(single_file: TemporaryUploadedFile, experiment_id: int):
    if single_file is None:
        raise InvalidInputError

    content = single_file.read().decode('utf-8-sig')
    file = io.StringIO(content)
    csv_reader = csv.DictReader(file)
    return validate_population_data(csv_reader, experiment_id, process_singlefile_row)
