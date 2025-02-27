from flask import Flask, request, jsonify
from flask_cors import CORS
from objects import *
from mongoDb import mongoDb
from dateutil import parser
from AppConfig import AppConfig
import logging
from firebaseAuthenticator import firebaseAuthenticator
from datetime import datetime, timezone
import requests
from downloadServer import DownloadServer

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# db = mongoDb("EmployeeManagementBackup")
db = mongoDb()
downloadServer = DownloadServer()
# Configure logging
logging.basicConfig(level=logging.INFO)


@app.route('/getIsDevEnvironment', methods=['GET'])
def get_is_dev_environment():

    devEnvironment = AppConfig().getIsDevEnvironment()
    return jsonify({"isDevEnvironment": devEnvironment}), 200


@app.route('/getIsTestEnvironment', methods=['GET'])
def get_is_test_environment():

    testEnvironment = AppConfig().getIsTestEnvironment()
    return jsonify({"isTestEnvironment": testEnvironment}), 200


@app.route('/getEnvironment', methods=['GET'])
def get_environment():
    environment = AppConfig().getEnvironment()
    return jsonify({
        "message": "Data read successfully",
        "data": environment
    }), 200


@app.route('/deleteAllDataInCollection', methods=['POST'])
def delete_all_data_in_collection():
    if request.is_json:

        if not AppConfig().getIsDevEnvironment():
            return jsonify({
                "error":
                "This endpoint is only available in Dev Environment"
            }), 400

        data = request.get_json()

        print(data)
        collection = data['collection']

        try:
            res = db.delete({}, collection)
            return jsonify({
                'message': 'Data deleted successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error deleting data: %s", e)
            return jsonify({'error': e.args[0]}), 400


@app.route('/readAllDataInCollection', methods=['POST'])
def read_all_data_in_collection():
    if request.is_json:
        data = request.get_json()
        collection = data['collection']
        # logging(collection)
        try:

            data = db.read({}, collection)
        except Exception as e:
            # Log the error with exception information
            logging.exception("Error reading purchase order: %s", e)
            # Respond with an error message
            return jsonify({'error': e.args[0]}), 400

        # If everything went fine
        return jsonify({
            "message": "Data read successfully",
            "data": data
        }), 200


@app.route('/firebaseLogin', methods=['POST'])
def firebase_login():
    if request.is_json:
        data = request.get_json()
        userObject = data['userObject']
        print(userObject, 'app.py')
        try:
            user = firebaseAuthenticator(userObject).login()
        except Exception as e:
            logging.exception("Error logging in: %s", e)
            return jsonify({'error': e.args[0]}), 400

        return jsonify({
            "message": "User logged in successfully",
            "data": user
        }), 200


@app.route('/createEmployee', methods=['POST'])
def create_employee():
    if request.is_json:
        employeeData = request.get_json()
        userData = employeeData['userData']
        data = employeeData['employee']

        try:
            if data['dateJoined']:
                data['dateJoined'] = datetime.strptime(data['dateJoined'],
                                                       "%Y-%m-%d")

            res = UserActions(userData).createEmployeeAction(
                userData, {
                    '_id': None,
                    'firstName': data['firstName'],
                    'lastName': data['lastName'],
                    'address': data['address'],
                    'phoneNumber': data['phoneNumber'],
                    'photoOfPerson': data['photoOfPerson'],
                    'resumePhotosList': data['resumePhotosList'],
                    'biodataPhotosList': data['biodataPhotosList'],
                    'employeeHouseRulesSignatureList': data['employeeHouseRulesSignatureList'],
                    'employeeImageGallery': data['employeeImageGallery'],
                    'email': data['email'],
                    'dateJoined': data['dateJoined'],
                    'company': data['company'],
                    'agency': data['agency'],
                    'isRegular': data['isRegular'],
                    'companyRole': data['companyRole'],
                    'isOJT': data['isOJT'],
                    'dailyWage': data['dailyWage'],
                    'isDeleted': False,
                    'employeeSignature': data['employeeSignature'] or None,
                    '_version': 0
                })

            return jsonify({
                'message': 'Employee created successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Employee: %s", e)
            return jsonify({'error': e.args[0]}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/updateEmployee', methods=['POST'])
def update_employee():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']

        employeeData = data['employeeData']
        dataToUpdate = data['dataToUpdate']
        try:

            if 'dateJoined' in dataToUpdate:
                dataToUpdate['dateJoined'] = datetime.strptime(
                    dataToUpdate['dateJoined'], "%Y-%m-%d")

            res = UserActions(userData).updateEmployeeAction(
                userData, employeeData, dataToUpdate)

            return jsonify({
                'message': 'Employee updated successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Employee: %s", e)
            return jsonify({'error': e.args[0]}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/deleteEmployee', methods=['POST'])
def delete_employee():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']

        employeeData = data['employeeData']
        try:
            res = UserActions(userData).deleteEmployeeAction(
                userData, employeeData)

            return jsonify({
                'message': 'Employee deleted successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Employee: %s", e)
            return jsonify({'error': e.args[0]}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/createOffense', methods=['POST'])
def create_offense():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        offense = data['offense']

        try:
            res = UserActions(userData).createOffenseAction(
                userData, {
                    '_id': None,
                    'remedialActions': offense['remedialActions'],
                    'title': offense['title'],
                    '_version': 0
                })

            return jsonify({
                'message': 'Offense created successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Offense: %s", e)
            return jsonify({'error': e.args[0]}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/updateOffense', methods=['POST'])
def update_offense():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']

        offenseData = data['offenseData']
        dataToUpdate = data['dataToUpdate']
        try:
            res = UserActions(userData).updateOffenseAction(
                userData, offenseData, dataToUpdate)

            return jsonify({
                'message': 'Offense updated successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Offense: %s", e)
            return jsonify({'error': e.args[0]}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/deleteOffense', methods=['POST'])
def delete_offense():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']

        offenseData = data['offenseData']
        try:
            res = UserActions(userData).deleteOffenseAction(
                userData, offenseData)

            return jsonify({
                'message': 'Offense deleted successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Offense: %s", e)
            return jsonify({'error': e.args[0]}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/createMemo', methods=['POST'])
def create_memo():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        memo = data['memo']

        try:

            if memo['date']:
                memo['date'] = datetime.strptime(memo['date'], "%Y-%m-%d")

            res = UserActions(userData).createMemoAction(
                userData, {
                    'date': memo['date'],
                    'mediaList': memo['mediaList'] or None,
                    'Employee': memo['Employee'],
                    'memoPhotosList': memo['memoPhotosList'] or None,
                    'subject': memo['subject'],
                    'description': memo['description'],
                    '_id': None,
                    'MemoCode': memo['MemoCode'],
                    'Code': None,
                    'submitted': False,
                    'isWithOffense': memo['isWithOffense'],
                    'reason': memo['reason'] or None,
                    'remedialActions': None,
                    '_version': 0
                })

            return jsonify({
                'message': 'Memo created successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Memo: %s", e)
            return jsonify({'error': e.args[0]}), 400
    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/submitMemo', methods=['POST'])
def submit_memo():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']

        memoData = data['memoData']
        reason = data['reason']
        try:
            res = UserActions(userData).submitMemoAction(
                userData, memoData, reason)

            return jsonify({
                'message': 'Memo submitted successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Memo: %s", e)
            return jsonify({'error': e.args[0]}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/getMemoList', methods=['POST'])
def get_memo_list():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        employeeId = data['employeeId']
        try:
            res = UserActions(userData).getMemoListAction(userData, employeeId)

            return jsonify({
                'message': 'Memo read successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Memo: %s", e)
            return jsonify({'error': e.args[0]}), 400
    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/deleteMemo', methods=['POST'])
def delete_memo():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']

        memoData = data['memoData']
        if memoData['reason'] == '':
            memoData['reason'] = None
        try:
            res = UserActions(userData).deleteMemoAction(userData, memoData)

            return jsonify({
                'message': 'Memo deleted successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Memo: %s", e)
            return jsonify({'error': e.args}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/getAllMemoThatsNotSubmitted', methods=['POST'])
def get_all_memo_thats_not_submitted():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']

        try:
            res = UserActions(userData).getAllMemoThatsNotSubmittedAction(
                userData)

            return jsonify({
                'message': 'Memo read successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Memo: %s", e)
            return jsonify({'error': e.args[0]}), 400

    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/getEmployeeForDashboardAction', methods=['POST'])
def get_employee_for_dashboard_action():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        page = data['page']
        sort = data['sort']

        try:
            res = UserActions(userData).getEmployeeForDashboardAction(userData, page, sort)
            return jsonify({
                'message': 'Employee read successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Employee: %s", e)
            return jsonify({'error': e.args[0]}), 400
    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/getEmployeeDetailsAction', methods=['POST'])
def get_employee_details_action():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        employeeId = data['employeeId']
        try:
            res = UserActions(userData).getEmployeeDetailsAction(
                userData, employeeId)
            return jsonify({
                'message': 'Employee read successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Employee: %s", e)
            return jsonify({'error': e.args[0]}), 400
    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/getUserForTesting', methods=['GET'])
def getUserForTesting():
    if AppConfig().getisLocalEnvironment():
        try:
            if len(db.read({}, 'User')) > 0:
                db.delete({}, 'User')

            print(Roles().getAllRolesWithPermissions())

            user = UserActions({
                '_id': None,
                'roles': {},
                'createdAt': datetime.now(timezone.utc),
                'isApproved': True,
                'image':
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLKqQ7NtUUGp8bSaplFyO23nW2YuWlj92q7Q&s',
                'displayName': 'TesTUseRnAme',
                'email': 'test@email.com',
                '_version': 0
            })

            userData = user.createFirstUserAction(firebaseUserUid='1234')

            return jsonify({
                'message': 'data read successfully!',
                'data': userData
            }), 200

        except Exception as e:
            logging.exception("Error processing Memo: %s", e)
            return e.args[0], 400

    else:
        return jsonify({"error": "Env is not in Local"}), 400


@app.route('/getRemedialActionForEmployeeMemoAction', methods=['POST'])
def get_remedial_action_for_employee_memo_action():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        employeeId = data['employeeId']
        offenseId = data['offenseId']
        offenseVersion = data['offenseVersion']
        try:
            res = UserActions(userData).getRemedialActionForEmployeeMemoAction(
                employeeId, offenseId, offenseVersion)
            return jsonify({
                'message': 'Employee read successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Employee: %s", e)
            return jsonify({'error': e.args[0]}), 400


@app.route('/getAllRoles', methods=['GET'])
def get_all_roles():
    try:
        res = Roles().getAllRoles()
        return jsonify({
            'message': 'Roles read successfully!',
            'data': res
        }), 200
    except Exception as e:
        logging.exception("Error reading Roles: %s", e)
        return jsonify({'error': e.args[0]}), 400


@app.route('/addRoleToUser', methods=['POST'])
def addRoleToUser():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        userDataToEdit = data['userDataToEdit']
        category = data['category']
        roleToAdd = data['roleToAdd']
        try:
            res = UserActions(userData).addRoleAction(userDataToEdit, category,
                                                      roleToAdd)
            return jsonify({
                'message': 'Roles added successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error adding Role: %s", e)
            return jsonify({'error': e.args[0]}), 400


@app.route('/removeRolefromUser', methods=['POST'])
def removeRolefromUser():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        userDataToEdit = data['userDataToEdit']
        category = data['category']
        roleToRemove = data['roleToRemove']
        try:
            res = UserActions(userData).removeRoleAction(
                userDataToEdit, category, roleToRemove)
            return jsonify({
                'message': 'Roles removed successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error removing Role: %s", e)
            return jsonify({'error': e.args[0]}), 400

@app.route('/updateEmployeeProfilePicture', methods=['POST'])
def update_employee_profile_picture():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        employeeID = data['employeeID']
        picture = data['picture']
        try:
            res = UserActions(userData).updateEmployeeProfilePictureAction(
                userData, employeeID, picture)
            return jsonify({
                'message': 'Profile Picture updated successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error updating Profile Picture: %s", e)
            return jsonify({'error': e.args[0]}), 400

@app.route('/fetchEmployeeList', methods=['POST'])
def fetch_employee_list():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']

        page = data['page']
        limit = data['limit']
        sort = data['sort']

        try:
            res = UserActions(userData).fetchEmployeeListAction(userData, page, limit, sort)
            return jsonify({
                'message': 'Employee read successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Employee: %s", e)
            return jsonify({'error': e.args[0]}), 400

@app.route('/getAllRecentMemo', methods=['POST'])
def get_all_recent_memo():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        try:
            res = UserActions(userData).getAllRecentMemoAction(userData)
            return jsonify({
                'message': 'Memo read successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error processing Memo: %s", e)
            return jsonify({'error': e.args[0]}), 400
        
@app.route('/updateUrlPhotoOfSignature', methods=['POST'])
def update_url_photo_of_signature():
    if request.is_json:
        data = request.get_json()
        userData = data['userData']
        employeeID = data['employeeID']
        signatureUrl = data['signatureUrl']
        try:
            res = UserActions(userData).updateUrlPhotoOfSignatureAction(
                userData, employeeID, signatureUrl)
            return jsonify({
                'message': 'Photo of Signature updated successfully!',
                'data': res
            }), 200
        except Exception as e:
            logging.exception("Error updating Photo of Signature: %s", e)
            return jsonify({'error': e.args[0]}), 400

@app.route('/downloadIDServer', methods=['POST'])
def downloadIDServer():
    if request.is_json:
        data = request.get_json()
        employeeID = data['employeeID']
        userData = data['userData']

        try:
            employee = UserActions(userData).getEmployeeBy_ID(employeeID)
            if not employee:
                return jsonify({"error": "Employee not found"}), 404

            if 'dateJoined' in employee:
                employee['dateJoined'] = employee['dateJoined'].isoformat()

            payload = {'employee':employee}
            urls = downloadServer.downloadEmployeeID(payload)

            print(urls, 'urls')

            resID ={
                "_id": employee['_id'],
                "name": employee['firstName'] + " " + employee['lastName'],
                "companyRole": employee['companyRole'],
                "IDCardURL": {"front":urls[0], "back":urls[1]},
                '_version': employee['_version']
            }

            idGenerated = UserActions(userData).createEmployeeIDAction(userData, employee, resID)

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
        app.run(debug=False, host='0.0.0.0', port=5000)
    else:
        # production
        app.run(host='0.0.0.0', port=8080)
        #
