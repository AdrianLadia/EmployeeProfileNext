from mongoDb import mongoDb
from dateutil import parser
import datetime
from utils import *
import re
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Union, List
from generateEmployeeID import EmployeeIDCard

# db = mongoDb("EmployeeManagementBackup")
db = mongoDb()


class Roles:

    def __init__(self):
        self.roles = {
            'User': {
                'canUpdateUser': {
                    'description': 'can update a user'
                },
                'canGetEmployeeForDashboard': {
                    'description': 'can get employee for dashboard'
                },
                'canGetMemoList': {
                    'description': 'can get a list of memos'
                },
                'canViewEmployeeDetails': {
                    'description': 'can view employee details'
                }
            },
            'Memo': {
                'canDeleteMemo': {
                    'description': 'can delete a memo'
                },
                'canSubmitMemo': {
                    'description': 'can submit a memo'
                },
                'canCreateMemo': {
                    'description': 'can create a memo'
                }
            },
            'Employee': {
                'canCreateEmployee': {
                    'description': 'can create an employee'
                },
                'canUpdateEmployee': {
                    'description': 'can update an employee'
                },
                'canDeleteEmployee': {
                    'description': 'can delete an employee'
                },
                'canGenerateEmployeeID': {
                    'description': 'can generate employee ID'
                },
            },
            'Offense': {
                'canCreateOffense': {
                    'description': 'can create an offense'
                },
                'canDeleteOffense': {
                    'description': 'can delete an offense'
                },
                'canUpdateOffense': {
                    'description': 'can update an offense'
                },
            }
        }

    def getAllRoles(self):
        return self.roles

    def getAllRolesWithPermissions(self):
        user_permissions = {}

        for role, permissions in self.roles.items():
            user_permissions[role] = []
            for permission in permissions:
                user_permissions[role].append(permission)

        return user_permissions

    def getAllRolesWithoutPermissions(self):
        user_permissions = {}

        for role, permissions in self.roles.items():
            user_permissions[role] = []

        return user_permissions


class User(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    # id: int = Field(..., alias='_id')
    createdAt: datetime.datetime
    isApproved: bool
    displayName: str
    email: str
    roles: dict
    version: int = Field(..., alias='_version')
    image: str

    @field_validator("createdAt", mode='before', check_fields=True)
    def parse_created_at(cls, value):
        if isinstance(value, datetime.datetime):
            return value
        elif isinstance(value, str):
            for transformDate in ("%Y-%m-%dT%H:%M:%S",
                                  "%a, %d %b %Y %H:%M:%S %Z"):
                try:
                    return datetime.datetime.strptime(value, transformDate)
                except ValueError:
                    continue
            raise ValueError("createdAt must be a valid datetime string")
        elif isinstance(value, (int, float)):
            return datetime.datetime.fromtimestamp(value)
        raise ValueError(
            "createdAt must be a valid datetime, string, or timestamp")

    def to_dict(self):
        return {
            '_id': self.id,
            'createdAt': self.createdAt,
            'isApproved': self.isApproved,
            'displayName': self.displayName,
            'image': self.image,
            'email': self.email,
            'roles': self.roles,
            '_version': self._version
        }

    def createFirstUser(self, firebaseUserUid):
        if self.id != None:
            raise ValueError('Cannot create User with an existing _id')

        users = db.read({}, 'User')
        if len(users) > 0:
            raise ValueError(
                'Cannot create first user. First user already exist in the system.'
            )

        self._version = 0

        data = {
            '_id': firebaseUserUid,
            '_version': self._version,
            'roles': Roles().getAllRolesWithPermissions(),
            'createdAt': datetime.datetime.now(datetime.timezone.utc),
            'isApproved': self.isApproved,
            'image': self.image,
            'displayName': self.displayName,
            'email': self.email
        }

        return data

    def createUser(self, firebaseUserUid):
        if self.id != None:
            raise ValueError('Cannot create User with an existing _id')

        user = db.read({'email': self.email}, 'Users')
        if len(user) > 0:
            raise ValueError('User already exists')

        self._version = 0

        data = {
            '_id': firebaseUserUid,
            '_version': self._version,
            'roles': Roles().getAllRolesWithoutPermissions(),
            'createdAt': datetime.datetime.now(datetime.timezone.utc),
            'isApproved': self.isApproved,
            'image': self.image,
            'displayName': self.displayName,
            'email': self.email,
        }

        return data

    # create a function that will add a role to a user
    def addRole(self, user, category, roleToAdd):
        if roleToAdd not in Roles().getAllRoles()[category]:
            raise ValueError(f'Role does not exist in category ')

        if roleToAdd in user['roles'][category]:
            raise ValueError(f'Role already exists')

        user['roles'][category].append(roleToAdd)
        print(f"Added role {roleToAdd} to category {category}")

        return user

    # create a function that will remove a role from a user
    def removeRole(self, user, category, roleToRemove):
        if roleToRemove not in user['roles'][category]:
            raise ValueError(f'Role does not exist in category')

        user['roles'][category].remove(roleToRemove)
        print(f"Removed role {roleToRemove} from category {category}")

        return user

    def validate_email(self, email):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, email):
            raise ValueError("Invalid email format.")
        return email


class UserActions(User):

    def __init__(self, data):
        super().__init__(**data)

    def createFirstUserAction(self, firebaseUserUid):
        print('ran' + firebaseUserUid)
        user = self.createFirstUser(firebaseUserUid)
        data = db.create(user, 'User')
        return data

    def createUserAction(self, firebaseUserUid):
        user = self.createUser(firebaseUserUid)
        data = db.create(user, 'User')
        return data

    def addRoleAction(self, userToEdit, category, roleToAdd):
        user = db.read({'_id': userToEdit['_id']}, 'User')
        if len(user) == 0:
            raise ValueError('User does not exist')

        data = self.addRole(user[0], category, roleToAdd)
        data = db.update({
            '_id': data['_id'],
            '_version': data['_version']
        }, {'roles': data['roles']}, 'User')
        return data

    def removeRoleAction(self, userToEdit, category, roleToRemove):
        user = db.read({'_id': userToEdit['_id']}, 'User')
        if len(user) == 0:
            raise ValueError('User does not exist')

        data = self.removeRole(user[0], category, roleToRemove)
        data = db.update({
            '_id': data['_id'],
            '_version': data['_version']
        }, {'roles': data['roles']}, 'User')
        return data

    def readCollection(self, collection_name):
        return db.read({}, collection_name)

    def createEmployeeAction(self, user, data):
        employee = Employee(**data)
        res = employee.createEmployee(user)
        return db.create(res, 'Employee')

    def updateEmployeeAction(self, user, data, dataToUpdate):
        employee = Employee(**data)
        res = employee.updateEmployee(user, dataToUpdate)
        return db.update({'_id': res['_id']}, res, 'Employee')

    def deleteEmployeeAction(self, user, data):
        employee = Employee(**data)
        res = employee.deleteEmployee(user)
        return db.update({'_id': res['_id']}, res, 'Employee')

    def createOffenseAction(self, user, data):
        if 'number' in data:
            offense = db.read({'number': data['number']}, 'Offense')
            if len(offense) > 0:
                raise ValueError('Offense number already exists')

        offense = Offense(**data)
        res = offense.createOffense(user)
        return db.create(res, 'Offense')

    def updateOffenseAction(self, user, data, dataToUpdate):
        offense = Offense(**data)
        incrementVersion = True
        if 'remedialActions' not in dataToUpdate:
            incrementVersion = False
        res = offense.updateOffense(user, dataToUpdate)
        return db.update({'_id': res['_id']},
                         res,
                         'Offense',
                         incrementVersion=incrementVersion)

    def deleteOffenseAction(self, user, data):
        offense = Offense(**data)
        res = offense.deleteOffense(user)
        return db.delete(res, 'Offense')

    def createMemoAction(self, user, data):
        memo = Memo(**data)
        res = memo.createMemo(user)
        return db.create(res, 'Memo')

    def deleteMemoAction(self, user, data):
        memo = Memo(**data)
        res = memo.deleteMemo(user)
        delete = db.delete({'_id': res['_id']}, 'Memo')

        employeeMemos = db.read(
            {
                'Employee._id': res['Employee']['_id'],
                'MemoCode._id': res['MemoCode']['_id'],
                'MemoCode._version': res['MemoCode']['_version']
            }, 'Memo')

        for index, memo in enumerate(employeeMemos):
            offenseCount = index + 1
            formattedDate = memo['date'].strftime('%y%m%d')
            company = memo['Employee']['company']
            newCode = f'{company}-{formattedDate}-{offenseCount}'
            memo['Code'] = newCode
            db.update({'_id': memo['_id']}, memo, 'Memo')

        return delete

    def submitMemoAction(self, user, data, reason):
        memo = Memo(**data)
        res = memo.submitMemo(user, reason)
        return db.update({'_id': res['_id']}, res, 'Memo')

    def getMemoListAction(self, user, employeeId):
        if 'canGetMemoList' not in user['roles']['User']:
            raise ValueError('User does not have permission to get memo list')

        memos = db.read({'Employee._id': employeeId},
                        'Memo',
                        projection={
                            '_id': 1,
                            'date': 1,
                            'mediaList': 1,
                            'Employee': 1,
                            'memoPhotosList': 1,
                            'MemoCode': 1,
                            'Code': 1,
                            'submitted': 1,
                            'reason': 1,
                            'subject': 1,
                            'description': 1,
                            'remedialAction': 1,
                        })

        if not memos:
            raise ValueError(f'No memos found for employee {employeeId}')

        return memos

    def getEmployeeForDashboardAction(
        self,
        user,
        page=1,
        sort={
            'keyToSort': None,
            'sortOrder': None
        },
    ):
        if 'canGetEmployeeForDashboard' not in user['roles']['User']:
            raise ValueError(
                'User does not have permission to get employee for dashboard')

        if page == None:
            page = 1
        if sort == None:
            sort = {'keyToSort': None, 'sortOrder': None}

        # employees = db.read({'isDeleted': False},
        #                     'Employee',
        #                     projection={
        #                         '_id': 1,
        #                         'firstName': 1,
        #                         'lastName': 1,
        #                         'address': 1,
        #                         'phoneNumber': 1,
        #                         'company': 1,
        #                         'photoOfPerson': 1,
        #                         'dateJoined': 1,
        #                         'companyRole': 1,
        #                         'isOJT': 1,
        #                         'isRegular': 1,
        #                         'isDeleted': 1,
        #                     })

        employees = db.readWithPagination({'isDeleted': False},
                                          'Employee',
                                          projection={
                                              '_id': 1,
                                              'firstName': 1,
                                              'lastName': 1,
                                              'address': 1,
                                              'phoneNumber': 1,
                                              'company': 1,
                                              'photoOfPerson': 1,
                                              'dateJoined': 1,
                                              'companyRole': 1,
                                              'isOJT': 1,
                                              'isRegular': 1,
                                              'isDeleted': 1,
                                          },
                                          page=1,
                                          limit=99999,
                                          sort=sort)

        return employees

    def getAllMemoThatsNotSubmittedAction(self, user):
        if 'canGetMemoList' not in user['roles']['User']:
            raise ValueError('User does not have permission to get memo list')

        memos = db.read({'submitted': False}, 'Memo')
        return memos

    def getEmployeeDetailsAction(self, user, employeeId):
        if 'canViewEmployeeDetails' not in user['roles']['User']:
            raise ValueError(
                'User does not have permission to view Employee Details')

        employee = db.read({'_id': employeeId}, 'Employee')
        return employee[0]

    def getRemedialActionForEmployeeMemoAction(self, employeeId, offenseId,
                                               offenseVersion):
        employeeMemos = db.read(
            {
                'Employee._id': employeeId,
                'MemoCode._id': offenseId,
                'MemoCode._version': offenseVersion
            }, 'Memo')

        offenseCount = len(employeeMemos)

        offense = db.read({'_id': offenseId}, 'Offense')

        remedialActions = offense[0]['remedialActions']

        if offenseCount >= len(remedialActions):
            return {
                'remedialAction': remedialActions[-1],
                'offenseCount': offenseCount + 1
            }

        return {
            'remedialAction': remedialActions[offenseCount],
            'offenseCount': offenseCount + 1
        }
    
    def createEmployeeIDAction(self, user, employee):
        if 'canGenerateEmployeeID' not in user['roles']['Employee']:
            raise ValueError('User does not have permission to generate Employee ID')

        idGenerated = EmployeeIDCard(**employee).generate_id_card()
        print(idGenerated)
        db.create(idGenerated, 'EmployeeID')
        return idGenerated['IDCardURL']

    def updateEmployeeProfilePictureAction(self, user, employeeId, photo):
        if 'canUpdateEmployee' not in user['roles']['Employee']:
            raise ValueError(
                'User does not have permission to update an employee')
        employee = db.read({'_id': employeeId}, 'Employee')
        if len(employee) == 0:
            raise ValueError('Employee does not exist')

        employee[0]['photoOfPerson'] = photo
        return db.update({'_id': employeeId}, employee[0], 'Employee')

    def fetchEmployeeListAction(self,
                                user,
                                page=1,
                                limit=10,
                                sort={
                                    'keyToSort': None,
                                    'sortOrder': None
                                }):
        if 'canGetEmployeeForDashboard' not in user['roles']['User']:
            raise ValueError(
                'User does not have permission to get employee for dashboard')

        if page == None:
            page = 1
        if limit == None:
            limit = 10
        if sort == None:
            sort = {'keyToSort': None, 'sortOrder': None}

        employees = db.readWithPagination({'isDeleted': False},
                                          'Employee',
                                          page=page,
                                          limit=limit,
                                          sort=sort)
        return employees

    def getAllRecentMemoAction(self, user):
        if 'canGetMemoList' not in user['roles']['User']:
            raise ValueError('User does not have permission to get memo list')

        memos = db.readWithPagination({},
                                      'Memo',
                                      page=1,
                                      limit=20,
                                      sort={
                                          'keyToSort': 'date',
                                          'sortOrder': -1
                                      })

        return memos['data']

    def updateUrlPhotoOfSignatureAction(self, user, employeeId, photo):
        if 'canUpdateEmployee' not in user['roles']['Employee']:
            raise ValueError(
                'User does not have permission to update an employee')
        employee = db.read({'_id': employeeId}, 'Employee')
        if len(employee) == 0:
            raise ValueError('Employee does not exist')

        employee[0]['employeeSignature'] = photo
        return db.update({'_id': employeeId}, employee[0], 'Employee')


class Memo(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    date: datetime.datetime
    mediaList: Optional[List[str]]
    Employee: 'Employee'
    memoPhotosList: Optional[List[str]]
    subject: str
    description: str
    MemoCode: 'Offense'
    Code: Optional[str]
    submitted: bool
    reason: Optional[str] = None
    remedialAction: Optional[str] = None
    version: int = Field(..., alias='_version')

    @field_validator("date", mode='before', check_fields=True)
    def parse_date(cls, value):
        if isinstance(value, datetime.datetime):
            return value
        elif isinstance(value, str):
            for transformDate in ("%Y-%m-%dT%H:%M:%S",
                                  "%a, %d %b %Y %H:%M:%S %Z"):
                try:
                    return datetime.datetime.strptime(value, transformDate)
                except ValueError:
                    continue
            raise ValueError("date must be a valid datetime string")
        elif isinstance(value, (int, float)):
            return datetime.datetime.fromtimestamp(value)
        raise ValueError("date must be a valid datetime, string, or timestamp")

    def to_dict(self):
        return {
            '_id': self.id,
            'date': self.date,
            'mediaList': self.mediaList,
            'Employee': self.Employee.to_dict(),
            'memoPhotosList': self.memoPhotosList,
            'subject': self.subject,
            'description': self.description,
            'MemoCode': self.MemoCode.to_dict(),
            'Code': self.Code,
            'submitted': self.submitted,
            'reason': self.reason,
            'remedialAction': self.remedialAction,
            '_version': self.version
        }

    def createMemo(self, user):
        if 'canCreateMemo' not in user['roles']['Memo']:
            raise ValueError('User does not have permission to create a memo')

        employeeId = self.Employee.id
        offenseId = self.MemoCode.id
        offenseVersion = self.MemoCode.version

        getRemedialAction = UserActions(
            user).getRemedialActionForEmployeeMemoAction(
                employeeId, offenseId, offenseVersion)

        remedialActionToString = getRemedialAction['remedialAction']

        self.remedialAction = remedialActionToString

        formattedDate = self.date.strftime('%y%m%d')

        self.id = generateRandomString()
        self.Code = f'{self.Employee.company}-{formattedDate}-{getRemedialAction["offenseCount"]}'
        self.submitted = False
        return self.to_dict()

    def deleteMemo(self, user):
        if 'canDeleteMemo' not in user['roles']['Memo']:
            raise ValueError('User does not have permission to delete a memo')
        if self.submitted:
            raise ValueError('Memo has already been submitted')

        return self.to_dict()

    def submitMemo(self, user, reason):
        if 'canSubmitMemo' not in user['roles']['Memo']:
            raise ValueError('User does not have permission to submit a memo')
        if self.submitted:
            raise ValueError('Memo has already been submitted')
        if reason == None:
            raise ValueError('Reason must be provided')
        if len(self.memoPhotosList) == 0:
            raise ValueError('Memo must have at least one photo')

        self.reason = reason
        self.submitted = True
        return self.to_dict()


class Employee(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    firstName: str
    lastName: str
    address: Optional[str]
    phoneNumber: Optional[str]
    photoOfPerson: Optional[str]
    resumePhotosList: Optional[List[str]]
    biodataPhotosList: Optional[List[str]]
    email: Optional[str]
    dateJoined: Optional[datetime.datetime]
    company: Optional[str]
    isRegular: Optional[bool]
    companyRole: Optional[str]
    isOJT: Optional[bool]
    dailyWage: Optional[Union[float, int]]
    isDeleted: Optional[bool] = False
    employeeSignature: Optional[str] = None
    version: int = Field(..., alias='_version')

    @field_validator("dateJoined", mode='before', check_fields=True)
    def parse_date_joined(cls, value):
        if value is None:
            return value
        if isinstance(value, datetime.datetime):
            return value
        elif isinstance(value, str):
            for transformDate in ("%Y-%m-%dT%H:%M:%S",
                                  "%a, %d %b %Y %H:%M:%S %Z"):
                try:
                    return datetime.datetime.strptime(value, transformDate)
                except ValueError:
                    continue
            raise ValueError("dateJoined must be a valid datetime string")
        elif isinstance(value, (int, float)):
            return datetime.datetime.fromtimestamp(value)
        raise ValueError(
            "dateJoined must be a valid datetime, string, or timestamp")

    def to_dict(self):
        return {
            '_id': self.id,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'address': self.address,
            'phoneNumber': self.phoneNumber,
            'photoOfPerson': self.photoOfPerson,
            'resumePhotosList': self.resumePhotosList,
            'biodataPhotosList': self.biodataPhotosList,
            'email': self.email,
            'dateJoined': self.dateJoined,
            'company': self.company,
            'isRegular': self.isRegular,
            'companyRole': self.companyRole,
            'isOJT': self.isOJT,
            'dailyWage': self.dailyWage,
            'isDeleted': self.isDeleted,
            'employeeSignature': self.employeeSignature,
            '_version': self.version
        }

    def createEmployee(self, user):
        if 'canCreateEmployee' not in user['roles']['Employee']:
            raise ValueError(
                'User does not have permission to create an employee')
        if self.id != None:
            raise ValueError('Cannot create Employee with an existing _id')
        self.id = generateRandomString()
        return self.to_dict()

    def updateEmployee(self, user, dataToUpdate):
        if 'canUpdateEmployee' not in user['roles']['Employee']:
            raise ValueError(
                'User does not have permission to update an employee')

        newData = updateData(self.to_dict(), dataToUpdate, ['_id'])
        return newData

    def deleteEmployee(self, user):
        if 'canDeleteEmployee' not in user['roles']['Employee']:
            raise ValueError(
                'User does not have permission to delete an employee')

        employee = db.read({'_id': self.id}, 'Employee')
        if len(employee) == 0:
            raise ValueError('Employee does not exist')
        self.isDeleted = True

        return self.to_dict()

    pass


class Offense(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    number: int
    description: str
    remedialActions: List[str]
    version: int = Field(..., alias='_version')
    title: Optional[str] = Field(None, alias='title')

    def to_dict(self):
        return {
            '_id': self.id,
            'number': self.number,
            'description': self.description,
            'remedialActions': self.remedialActions,
            '_version': self.version,
            'title': self.title
        }

    def createOffense(self, user):
        if 'canCreateOffense' not in user['roles']['Offense']:
            raise ValueError(
                'User does not have permission to create an offense')
        self.id = generateRandomString()
        return self.to_dict()

    def updateOffense(self, user, dataToUpdate):
        if 'canUpdateOffense' not in user['roles']['Offense']:
            raise ValueError(
                'User does not have permission to update an offense')

        newData = updateData(self.to_dict(), dataToUpdate, ['_id'])

        return newData

    def deleteOffense(self, user):
        if 'canDeleteOffense' not in user['roles']['Offense']:
            raise ValueError(
                'User does not have permission to delete an offense')

        offense = db.read({'_id': self.id}, 'Offense')
        if len(offense) == 0:
            raise ValueError('Offense does not exist')

        return self.to_dict()


if __name__ == "__main__":
    user = User(_id='123',
                createdAt=123,
                isApproved=True,
                displayName='test',
                email='test',
                roles=['test'],
                _version=1,
                image='test')
    userDict = user.dict()
    x = user.json()
    schema = user.schema()
