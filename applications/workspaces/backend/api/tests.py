from django.contrib.auth.models import User

# Create your tests here.
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIRequestFactory, force_authenticate

from api.views.rest.experiment import ExperimentViewSet


class ExperimentTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(
            username="metacell", first_name="Meta", last_name="Cell"
        )

    def test_list_experiments(self):
        user = User.objects.get(username="metacell")
        view = ExperimentViewSet.as_view({"get": "list"})

        request = APIRequestFactory().get("")
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])
