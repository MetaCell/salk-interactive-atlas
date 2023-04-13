from api.helpers.population_registration.fiducial_registration_strategy import FiducialCellRegistrationStrategy
from api.helpers.population_registration.ipopulation_registration_strategy import PopulationRegistrationStrategy
from api.helpers.population_registration.non_fiducial_registration_strategy import NonFiducialCellRegistrationStrategy


def get_population_registration_strategy(is_fiducial: bool) -> PopulationRegistrationStrategy:
    if is_fiducial:
        return FiducialCellRegistrationStrategy()
    else:
        return NonFiducialCellRegistrationStrategy()
