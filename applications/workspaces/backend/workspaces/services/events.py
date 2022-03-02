import time

from cloudharness import log
from cloudharness.events.client import EventClient
from kafka.errors import TopicAlreadyExistsError

from workspaces.services.user import user_service

def handler_keycloak_admin_event(app, event_client, message):
    log.info(f"{event_client} {message}")
    resource = message["resource-type"]
    operation = message["operation-type"]
    if resource == "GROUP":       
        user_service.sync_kc_users_groups()
    if resource == "GROUP_MEMBERSHIP":
        resource_path = message["resource-path"].split("/")
        # adding / deleting users from groups
        user_service.sync_kc_users_groups()


class MessageHandler:
    _event_topics = (
        {"topic": "keycloak.fct.admin", "handler": handler_keycloak_admin_event},
    )

    def __init__(self):
        self._event_clients = []
        self.init_topics()

    def init_topics(self):
        log.info("Starting Kafka consumer threads")
        for topic in self._event_topics:
            try:
                event_client = EventClient(topic["topic"])
                try:
                    # try to create the topic, if it exists it will throw an exception
                    event_client.create_topic()
                except TopicAlreadyExistsError as e:
                    pass
                event_client.async_consume(app={}, group_id="salk", handler=topic["handler"])
                self._event_clients.append(event_client)
            except Exception as e:
                log.error(f"Error creating topic {topic['topic']}", exc_info=e)

    def stop(self):
        for event_client in self._event_clients:
            event_client.close()


def test_kafka_running():
    try:
        EventClient("mnp-ifn-testing")._get_consumer()
    except:
        return False
    return True


def setup_event_service():
    nap_time = 30
    kafka_running = False
    while not kafka_running:
        kafka_running = test_kafka_running()
        if not kafka_running:
            log.info(f"Kafka not running? Going for a {nap_time} seconds power nap and will try again later")
            time.sleep(nap_time)
    mh = MessageHandler()


# start services
setup_event_service()
