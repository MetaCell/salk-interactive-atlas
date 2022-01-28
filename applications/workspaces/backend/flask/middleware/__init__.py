from django.conf import settings
import flask

class FlaskRequest:
    def __init__(self, request):
        self.headers = {
            "Authorization": request.META.get("HTTP_AUTHORIZATION")
        }


class FlaskApp:
    def __init__(self, request):
        self.config = {
            "ENV": "development" if settings.DEBUG else "production"
        }


def FlaskRequestExposerMiddleware(get_response):
    def middleware(request):
        flask.request = FlaskRequest(request)
        flask.current_app = FlaskApp(request)
        response = get_response(request)
        return response

    return middleware
