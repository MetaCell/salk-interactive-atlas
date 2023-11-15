from api.helpers.experiment_registration.fiducial_registration_strategy import FiducialExperimentRegistrationStrategy
from api.helpers.experiment_registration.iexperiment_registration_strategy import ExperimentRegistrationStrategy
from api.helpers.experiment_registration.non_fiducial_registration_strategy import NonFiducialExperimentRegistrationStrategy


def get_registration_strategy(is_fiducial: bool) -> ExperimentRegistrationStrategy:
    if is_fiducial:
        return FiducialExperimentRegistrationStrategy()
    else:
        return NonFiducialExperimentRegistrationStrategy()
