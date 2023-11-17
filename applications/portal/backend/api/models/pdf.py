
from django.db import models
from django.contrib.auth.models import User
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
    name = models.CharField(max_length=40)
    category = models.CharField(max_length=40, choices=PDFCategory.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
		User,
		related_name="pdf_created_by",
		on_delete=models.CASCADE,
	)
    file = models.TextField(blank=True, null=True)   ## TODO: this cannot save long file names
    population = models.ForeignKey(
		Population,
		related_name="population_pdf",
		on_delete=models.CASCADE,
	)


    @staticmethod
    def has_read_permission(request):
        return True

    @staticmethod
    def has_list_permission(request):
        return True

    @staticmethod
    def has_destroy_permission(request):
        return True
    
    def has_object_write_permission(self, request):
        return self.population.experiment and self.population.experiment.has_object_write_permission(request)


