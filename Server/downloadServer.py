from flask import Flask, request, jsonify
from flask_cors import CORS
from objects import *
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
        userData = data['userData']

        if employee['dateJoined']:
            employee['dateJoined'] = datetime.strptime(
                employee['dateJoined'], "%a, %d %b %Y %H:%M:%S %Z")

        try:
            generateID = EmployeeIDCard(**employee).generate_id_card()

            employeeID = uploadListToFirebaseStorage(generateID, 'EmployeeIDs')

            to_return = {
                "_id": employee['_id'],
                "name": employee['firstName'] + " " + employee['lastName'],
                "companyRole": employee['companyRole'],
                "IDCardURL": {"front":employeeID[0], "back":employeeID[1]},
                '_version': employee['_version']
            }

            idGenerated = UserActions(userData).createEmployeeIDAction(userData, employee, to_return)

        except Exception as e:
            return jsonify({"error": str(e)}), 400

        return jsonify({
            "employeeID": idGenerated,
            "message": "Employee ID Card generated successfully"
            }), 200

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


