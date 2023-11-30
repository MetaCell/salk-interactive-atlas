from django.db import models
from django.contrib.auth.models import User

from . import Experiment
from .population import Population


class PDFCategory(models.TextChoices):
    ELECTROPHYSIOLOGY = 'ELECTROPHYSIOLOGY'
    BEHAVIOUR = 'BEHAVIOUR'
    IO_MAPPING = 'IO_MAPPING'


'''
	PopulationPDF associate to each population. 
	Population can have multiple PDFs of any of following categories:
		- ELECTROPHYSIOLOGY, BEHAVIOUR, IO_MAPPING
'''


class Pdf(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=40, choices=PDFCategory.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User,
        related_name="pdf_created_by",
        on_delete=models.CASCADE,
    )
    file = models.FileField(null=True, blank=True, max_length=255)
    population = models.ForeignKey(
        Population,
        related_name="population_pdf",
        on_delete=models.CASCADE,
    )
    experiment = models.ForeignKey(
        Experiment,
        on_delete=models.CASCADE,
        related_name="experiment_pdfs"
    )

    @staticmethod
    def has_read_permission(request):
        return True

    @staticmethod
    def has_write_permission(request):
        return True

    def has_object_read_permission(self, request):
        if request.user == self.created_by:
            return True
        return not self.experiment.is_private

    def has_object_destroy_permission(self, request):
        return request.user == self.created_by
