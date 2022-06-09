from api.helpers.exceptions import InvalidInputError


def validate_input_files(key_file, data_file):
    if key_file is None or data_file is None:
        raise InvalidInputError
    return True
