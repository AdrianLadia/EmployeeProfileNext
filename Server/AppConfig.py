import os
import datetime


class Timezone:

    def __init__(self):
        super().__init__()
        #gmt + 8
        self.timezone = 8

    def getTimezone(self):
        return datetime.timezone(datetime.timedelta(hours=self.timezone))


class Environment:

    def __init__(self):
        super().__init__()
        self.environment = os.getenv('ENVIRONMENT', 'clouddev')
        if self.environment not in [
                'localdev', 'localprod', 'clouddev', 'cloudprod', 'localTest',
                'cloudTest'
        ]:
            raise Exception("Invalid environment")

    def getEnvironment(self):
        return self.environment

    def getIsCloudEnvironment(self):
        return self.getEnvironment() in ['clouddev', 'cloudprod']

    def getIsProductionEnvironment(self):
        return self.getEnvironment() in ['cloudprod']

    def getisLocalDevEnvironment(self):
        return self.getEnvironment() in ['localdev']

    def getisLocalEnvironment(self):
        return self.getEnvironment() in ['localdev', 'localprod']

    def getIsDevEnvironment(self):
        return self.getEnvironment() in ['localdev', 'clouddev']

    def getIsTestEnvironment(self):
        return self.getEnvironment() in ['localTest', 'cloudTest']


class PubSubConfig:

    def __init__(self):
        super().__init__()
        # Pub/Sub settings
        self.PROJECT_ID = ''

        # setting runLocalPubSub to True or False. If set to true the pubsub will make
        # a request to another local server that the user specified in the function to
        # mock the pubsub. If set to false the pubsub will skip this step.
        # THIS IS USED FOR TESTING PURPOSES
        runLocalPubSub = os.getenv('runLocalPubSub', "true").lower()
        if runLocalPubSub not in ['true', 'false']:
            raise ValueError(
                "Invalid value for runLocalPubSub. Must be 'true' or 'false'.")

        if runLocalPubSub == 'true':
            runLocalPubSub == True
        elif runLocalPubSub == 'false':
            runLocalPubSub == False

    def getProjectId(self):
        return self.PROJECT_ID


class AppConfig(Environment, PubSubConfig, Timezone):

    def __init__(self):
        super().__init__()


if __name__ == "__main__":
    appConfig = AppConfig()
