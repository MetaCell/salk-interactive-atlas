from abc import ABC, abstractmethod


class PopulationRegistrationStrategy(ABC):

    @abstractmethod
    def register(self, data_filepath: str, out_dir: str):
        pass

    @abstractmethod
    def get_csv_suffix(self) -> str:
        pass
