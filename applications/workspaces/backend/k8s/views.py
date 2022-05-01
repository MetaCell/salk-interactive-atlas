from django.http import HttpResponse

# Create your views here.


def live(request):
    return HttpResponse("OK")


def ready(request):
    return HttpResponse("OK")
