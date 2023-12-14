import csv
import io
import os
import tempfile
import zipfile

from django.db.models import Q
from django.http import HttpResponse

from api.models import Population


def get_populations_zip(active_populations, experiment):
    filename_prefix = f'{experiment.name}' if experiment else 'population'
    filename_suffix = 's' if len(active_populations) > 1 else ''

    temp_file = tempfile.TemporaryFile()
    with zipfile.ZipFile(temp_file, 'w') as zip_file:
        for population in Population.objects.filter(Q(experiment=experiment) | Q(experiment=None), id__in=active_populations):
            if population.cells:
                modified_csv_content = modify_csv_headers(population.cells.path)
                zip_file.writestr(os.path.basename(population.cells.path), modified_csv_content)
                filename_prefix += f"_{population.name}"

    temp_file.seek(0)  # Reset file pointer
    return temp_file, f"{filename_prefix}_population{filename_suffix}.zip"



def modify_csv_headers(csv_file_path):
    with open(csv_file_path, 'r') as csvfile:
        reader = csv.reader(csvfile)
        modified_data = io.StringIO()
        writer = csv.writer(modified_data)

        # Swap 'x' and 'y' in headers
        headers = next(reader)
        x_index = headers.index('x')
        y_index = headers.index('y')
        headers[x_index], headers[y_index] = headers[y_index], headers[x_index]
        writer.writerow(headers)

        # Write the rest of the rows as they are
        for row in reader:
            writer.writerow(row)

        modified_data.seek(0)
        return modified_data.getvalue()