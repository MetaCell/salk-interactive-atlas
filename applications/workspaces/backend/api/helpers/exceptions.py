class AuthorizationError(Exception):
    """Exception raised for authorization errors"""

    pass


class InvalidInputError(Exception):
    """Exception raised for invalid input errors"""

    pass


class DensityMapIncorrectSubdivisionError(Exception):
    pass


class DensityMapMultipleAtlasesFoundError(Exception):
    pass
