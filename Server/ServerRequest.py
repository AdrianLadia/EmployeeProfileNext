import requests
from urllib.parse import urljoin


class ServerRequest:
    def __init__(self, serverBaseUrl, headers):
        self.serverBaseUrl = serverBaseUrl
        self.headers = headers

    def post(self, targetUrl, payload):
        url = urljoin(self.serverBaseUrl, targetUrl)
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status(
            )  # Raises an HTTPError for bad responses
            return response.json()
        except requests.exceptions.RequestException as e:
            return f"Request failed: {e}"
