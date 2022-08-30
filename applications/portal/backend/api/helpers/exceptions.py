class AuthorizationError(Exception):
    """Exception raised for authorization errors"""

    pass


class InvalidInputError(Exception):
    """Exception raised for invalid input errors"""

    pass


class DensityMapIncorrectSubdivisionError(Exception):
    pass


class NoImageDataError(Exception):
    """Exception raised for errors in generating images due to the lack of data"""

    pass
