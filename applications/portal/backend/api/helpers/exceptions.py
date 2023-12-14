class AuthorizationError(Exception):
    """Exception raised for authorization errors"""

    pass


class InvalidInputError(Exception):
    """Exception raised for invalid input errors"""
    pass


class InvalidPopulationFile(Exception):
    """Exception raised for invalid input errors"""
    def __init__(self, repeated_population_name):
        super().__init__(f"File contains repeated population: {repeated_population_name}")


class InvalidPDFFile(Exception):
    """Exception raised for invalid input errors"""

    def __init__(self):
        super().__init__(f"Invalid file type, must be a pdf")



class DuplicatedPopulationError(Exception):
    """Exception raised for duplicate populations"""
    def __init__(self, duplicated_population):
        super().__init__(f"Duplicated population: {duplicated_population}")


class DensityMapIncorrectSubdivisionError(Exception):
    pass


class NoImageDataError(Exception):
    """Exception raised for errors in generating images due to the lack of data"""

    pass


class UserNotFoundInExperimentError(Exception):
    """Exception raised for errors in generating images due to the lack of data"""

    pass

