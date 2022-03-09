import time

from django.conf import settings
from kafka.errors import TopicAlreadyExistsError

from cloudharness import log
from cloudharness.events.client import EventClient

from kcoidc.exceptions import KeycloakOIDCNoProjectError
from kcoidc.services import get_user_service, get_auth_service


class KeycloakMessageService:

    def __init__(self, kafka_group_id):
        self._topic = "keycloak.fct.admin"
        self.kafka_group_id = kafka_group_id

    @staticmethod
    def event_handler(app, event_client, message):
        resource = message["resource-type"]
        operation = message["operation-type"]
        resource_path = message["resource-path"].split("/")

        log.debug(f"{event_client} {message}")
        if resource in ["CLIENT_ROLE_MAPPING","GROUP","USER","GROUP_MEMBERSHIP"]:
            try:
                user_service = get_user_service()
                auth_client = get_auth_service().get_auth_client()

                time.sleep(0.01) # give keycloak a little bit of time to persist the changes

                if resource == "GROUP":
                    kc_group = auth_client.get_group(resource_path[1])
                    user_service.sync_kc_group(kc_group)
                if resource == "USER":
                    kc_user = auth_client.get_user(resource_path[1])
                    user_service.sync_kc_user(kc_user, delete=operation == "DELETE")
                if resource == "CLIENT_ROLE_MAPPING":
                    # adding/deleting user client roles
                    # set/user user is_superuser
                    kc_user = auth_client.get_user(resource_path[1])
                    user_service.sync_kc_user(kc_user, delete=operation == "DELETE")
                if resource == "GROUP_MEMBERSHIP":
                    # adding / deleting users from groups, update the user
                    # updating the user will also update the user groups
                    kc_user = auth_client.get_user(resource_path[1])
                    user_service.sync_kc_user(kc_user)
            except Exception as e:
                log.error(e)
                raise e

    def init_topics(self):
        log.info("Starting Kafka consumer threads")
        try:
            event_client = EventClient(self._topic)
            try:
                # try to create the topic, if it exists it will throw an exception
                event_client.create_topic()
            except TopicAlreadyExistsError as e:
                pass
            event_client.async_consume(app={}, group_id=self.kafka_group_id, handler=KeycloakMessageService.event_handler)
        except Exception as e:
            log.error(f"Error creating topic {self._topic}", exc_info=e)

    @classmethod
    def test_kafka_running(cls):
        try:
            EventClient("keycloak-dummy-client")._get_consumer()
        except:
            return False
        return True

    def setup_event_service(self):
        nap_time = 30
        kafka_running = False
        while not kafka_running:
            kafka_running = self.test_kafka_running()
            if not kafka_running:
                log.info(f"Kafka not running? Going for a {nap_time} seconds power nap and will try again later")
                time.sleep(nap_time)
        self.init_topics()


# start services
if not hasattr(settings, "PROJECT_NAME"):
    raise KeycloakOIDCNoProjectError("Project name not found, please set PROJECT_NAME in your settings module")

KeycloakMessageService(settings.PROJECT_NAME).setup_event_service()
