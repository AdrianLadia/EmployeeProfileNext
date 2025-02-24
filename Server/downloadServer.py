from ServerRequest import ServerRequest
from AppConfig import AppConfig

class DownloadServer ():
    def __init__(self):
        if AppConfig().getIsProductionEnvironment() == True:
            self.baseUrl = 'https://curious-lamb-evident.ngrok-free.app' 
        else:
            # self.baseUrl = 'http://127.0.0.1:80'
            self.baseUrl ='https://curious-lamb-evident.ngrok-free.app'

        self.__server = ServerRequest(self.baseUrl, {'Content-Type': 'application/json'})
    
    def downloadEmployeeID(self,payload):
        return self.__server.post('/downloadID', payload)
