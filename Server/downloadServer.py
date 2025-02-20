from flask import Flask, request, jsonify
from flask_cors import CORS
from generateEmployeeID import EmployeeIDCard
from firebase_admin import credentials, storage, initialize_app, get_app, _apps
import random
import os
import logging
import string
from AppConfig import AppConfig
import time
from datetime import datetime, timezone


cd = os.path.dirname(os.path.abspath(__file__))
keyPath = cd + '\\' + r'\keys\pustananemployeeprofile-firebase-adminsdk-47jwz-bc5daaacc7.json'
cred = credentials.Certificate(keyPath)
initialize_app(
    cred, {'storageBucket': 'pustananemployeeprofile.firebasestorage.app'})

bucket = storage.bucket()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

logging.basicConfig(level=logging.INFO)

def uploadListToFirebaseStorage( list_of_photos, folder_name):
    if not _apps:
        cred = credentials.Certificate(
            "Server/keys/pustananemployeeprofile-firebase-adminsdk-47jwz-bc5daaacc7.json"
        )
        initialize_app(cred, {
            "storageBucket":
            "pustananemployeeprofile.firebasestorage.app"
        })

    bucket = storage.bucket()
    download_urls = []
    for photo in list_of_photos:
        blob = bucket.blob(f"{folder_name}/{photo}")
        blob.upload_from_filename(photo)
        blob.make_public()

        download_url = f"{blob.public_url}?updated={int(time.time())}"
        download_urls.append(download_url)
        print(f"{photo} uploaded to Firebase Storage" + download_url)

    return download_urls

@app.route('/downloadID', methods=['POST'])
def downloadID():
    if request.is_json:
        data = request.get_json()
        employee = data['employee']

        if employee['dateJoined']:
            employee['dateJoined'] = datetime.fromisoformat(employee['dateJoined'])

        try:
            generateID = EmployeeIDCard(**employee).generate_id_card()

            employeeID = uploadListToFirebaseStorage(generateID, 'EmployeeIDs')

            return employeeID

        except Exception as e:
            return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    if (AppConfig().getIsDevEnvironment()):
        print(
            f"\033[92m_______________________{AppConfig().getEnvironment().upper()}_______________________\033[0m"
        )
    if AppConfig().getIsProductionEnvironment():
        print(
            f"\033[91m_______________________{AppConfig().getEnvironment().upper()}_______________________\033[0m"
        )

    if AppConfig().getisLocalEnvironment():
        # dev
        app.run(debug=False, host='0.0.0.0', port=80)
    else:
        # production
        app.run(port=80)


