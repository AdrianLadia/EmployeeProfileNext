export function clearCollections(serverRequests){
  cy.wrap(serverRequests.deleteAllDataInCollection('Employee')).then((deleteResponse) => {
    expect(deleteResponse).to.have.property('message', 'Data deleted successfully!');
  });

  cy.wrap(serverRequests.deleteAllDataInCollection('Offense')).then((deleteResponse) => {
    expect(deleteResponse).to.have.property('message', 'Data deleted successfully!');
  });

  cy.wrap(serverRequests.deleteAllDataInCollection('Memo')).then((deleteResponse) => {
    expect(deleteResponse).to.have.property('message', 'Data deleted successfully!');
  });
}

export function formattedDate(){
  const date = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
}

export function formattedDateWithDash(){
  const date = new Date();
  const day = date.getDate();
  let month = date.getMonth()+1;
  if (month < 10) {
    month = '0' + month;
  }
  const year = date.getFullYear();
  const formattedDateWithDash = `${year}-${month}-${day}`;
  return formattedDateWithDash;
}

export function CreateEmployee(
  name = "John Doe",
  // address = "1234 Elm Street, Springfield",
  // phoneNumber = "+1234567890",
  // photoOfPerson = 'minor.png',
  // resumePhotosList = 'smiley.png',
  // biodataPhotosList = 'mhm.png',
  // email = "johndoe@example.com",
  // dateJoined = "2024-11-01",
  // company = "TechCorp Inc.",
  // dailyWage = "500"
){
  cy.get('#profile-button').should('be.visible').click()

  cy.contains('Create Employee').should('be.visible').click()
  cy.url().should('include', '/Employee/Create')

  cy.get('#profile-button').should('be.visible').click()

  cy.get('#name').type(name)
  // cy.get('#address').type(address)
  // cy.get('#phoneNumber').type(phoneNumber)
  // cy.get('input[type=file]#photoOfPerson').attachFile(photoOfPerson)
  // cy.get('input[type=file]#resumePhotosList').attachFile(resumePhotosList)
  // cy.get('input[type=file]#biodataPhotosList').attachFile(biodataPhotosList)
  // cy.get('#email').type(email)
  // cy.get('#dateJoined').type(dateJoined)
  // cy.get('#company').type(company)
  // cy.get('#isRegular').check()
  // cy.get('#isProductionEmployee').uncheck()
  // cy.get('#dailyWage').type(dailyWage)
  // cy.wait(1000)
  cy.get('#submit').click()
  cy.wait(1000)
  cy.get('#confirm-button').click()
  cy.wait(4000)
}

export function UpdateEmployee({
  employee = "John Doe",
  name = "John Doe Jr",
  address = "1234 Elm Street, Springfield",
  phoneNumber = "+1234567890",
  photoOfPerson = 'minor.png',
  resumePhotosList = 'smiley.png',
  biodataPhotosList = 'mhm.png',
  email = "johndoe@example.com",
  dateJoined = "2024-11-01",
  company = "PPB",
  dailyWage = "500"
}={}){
  cy.get('#profile-button').should('be.visible').click()

  cy.contains('Update Employee').click()

  cy.get('#profile-button').should('be.visible').click()

  cy.get('#Employee').click()
  cy.get('.css-1nmdiq5-menu')
  .contains(employee)
  .click();

  cy.get('#name').clear().type(name)
  cy.get('#address').clear().type(address)
  cy.get('#phoneNumber').clear().type(phoneNumber)
  cy.get('input[type=file]#photoOfPerson').attachFile(photoOfPerson)
  cy.get('input[type=file]#resumePhotosList').attachFile(resumePhotosList)
  cy.get('input[type=file]#biodataPhotosList').attachFile(biodataPhotosList)
  cy.get('#email').clear().type(email)
  cy.get('#dateJoined').clear().type(dateJoined)
  // cy.get('#add-option').click()
  // cy.wait(1000)
  // cy.get('#company').click().type(company)
  // cy.wait(3000)
  // cy.get('#save-option').click()

  cy.get('#isRegular').uncheck()
  // cy.get('#isProductionEmployee').check()
  cy.get('#dailyWage').clear().type(dailyWage)

  cy.get('#save').click()
  cy.wait(3000)
  cy.get('#confirm-button').click()
  cy.wait(6000)
}

export function DeleteEmployee(name){
  cy.get('#profile-button').should('be.visible').click()
  cy.contains('Delete Employee').click()
  cy.get('#Employee').click()
  cy.get('.css-1nmdiq5-menu')
  .contains(name)
  .click();
  cy.get('#delete-employee-btn').click()
  cy.wait(1000)
  cy.get('#confirm-button').click()
  cy.wait(1000)
  cy.get('#profile-button').should('be.visible').click()
}

export function CreateOffense(
  description = "Employee was late to work",
  offenseType = ["Verbal Warning", "Written-Warning"],
){
  cy.get('#profile-button').should('be.visible').click()
  cy.contains('Create Offense').click()
  cy.get('#profile-button').should('be.visible').click()
  cy.location('pathname').should('include', '/Offense/Create')
  cy.get('#number').type('1')
  cy.get('#title').type('Employee was late to work')
  cy.get('#description').type(description)

  offenseType.forEach((type) => {
    cy.get('#'+type).click()
  })

  cy.get('#create-offense-button').click()
  cy.wait(1000)
  cy.get('#confirm-button').click()
  cy.wait(4000)
}

export function UpdateOffense({
  offense = "Employee was late to work",
  number = "1",
  title = "Employee was late to work",
  description = "Employee was late to work and was rude to customers",
  offenseType = ["Suspension"]
}={}){
  cy.get('#profile-button').should('be.visible').click()
  cy.wait(1000)
  cy.contains('Update Offense').click()
  cy.get('#profile-button').should('be.visible').click()
  cy.location('pathname').should('include', '/Offense/Update')
  cy.wait(1000)
  cy.get('#select-offense').click()
  cy.get('.css-1nmdiq5-menu')
  .contains(offense)
  .click();
  cy.get('#number').type(number)
  cy.get('#title').type(title)
  cy.get('#description').type(description)
  cy.wait(1000)
  // cy.get('#description')

  offenseType.forEach((type) => {
    console.log(type)
    // cy.get('#'+type).click()
  })

  cy.get('#update-offense-button').click()
  cy.wait(1000)
  cy.get('#confirm-button').click()
}

export function DeleteOffense(description){
  cy.wait(3000)
  cy.get('#profile-button').should('be.visible').click()
  cy.contains('Delete Offense').click()
  cy.get('#profile-button').should('be.visible').click()
  cy.wait(1000)
  cy.get('#select-memo').click()
  cy.wait(1000)
  cy.get('.css-1nmdiq5-menu')
  .contains(description)
  .click();
  cy.wait(1000)
  cy.get('#delete-offense-btn').click()
  cy.wait(1000)
  cy.get('#confirm-button').click()
  cy.wait(4000)
}

export function CreateMemo(
  employee = 'John Doe Jr',
  memoCode = 'Employee was late to work and was rude to customers',
  subject = 'Workplace Safety Protocols',
  description = 'Reminder to adhere to updated safety protocols in the workplace. Ensure all employees are aware and compliant.',
  // reason = null,
  mediaList = 'smiley.png',
  memoPhotosList = 'mhm.png'
){
  const date = formattedDateWithDash();
  cy.get('#profile-button').should('be.visible').click()
  cy.contains('Create Memorandum').click()
  cy.get('#profile-button').should('be.visible').click()
  cy.location('pathname').should('include', '/Memorandum/Create')
  cy.get('#date').type(date)
  cy.get('#select-employee').click()
  cy.get('.css-1nmdiq5-menu')
  .contains(employee)
  .click();
  cy.get('#MemoCode').click()
  cy.get('.css-1nmdiq5-menu')
  .contains(memoCode)
  .click();
  cy.get('#subject').type(subject)
  cy.get('#description').type(description)
  // cy.get('#reason').type(reason)
  cy.get('input[type=file]#mediaList').attachFile(mediaList)
  cy.wait(1000)
  cy.get('input[type=file]#memoPhotosList').attachFile(memoPhotosList)
  cy.wait(1000)
  cy.get('#create-memo-btn').click()
  cy.wait(1000)
  cy.get('#confirm-button').click()
  cy.wait(4000)
}

export function SubmitMemo({
  employee = 'John Doe Jr',
  memo = 'Employee was late to work and was rude to customers',
  reason = 'Employee was stuck in traffic',
  mediaList = 'smiley.png',
  memoPhotosList = 'mhm.png'
} = {}){
  cy.wait(3000)
  const date = formattedDate();
  cy.get('#profile-button').should('be.visible').click()
  cy.contains('Submit Memorandum').click()
  cy.get('#profile-button').should('be.visible').click()
  cy.get('#select-offense').click()
  cy.get('.css-1nmdiq5-menu')
  .contains(employee + ', '+ memo + ' ('+ date +')')
  .click();
  // cy.get('#reason').type(reason)
  // cy.get('#mediaList').attachFile(mediaList)
  // cy.get('#memoPhotosList').attachFile(memoPhotosList)
  cy.wait(1000)
  cy.get('#submit-memo-btn').click()
  cy.wait(1000)
  cy.get('#confirm-button').click()
  cy.wait(3000)
}

export function DeleteMemo({
  employee = 'John Doe Jr',
  memo = 'Employee was late to work and was rude to customers'
} = {}) {
  // console.log(formattedDate);
  const dateStr = formattedDate();
  cy.get('#profile-button').should('be.visible').click()
  cy.contains('Delete Memorandum').click()
  cy.get('#profile-button').should('be.visible').click()
  cy.get('#select-offense').click()
  cy.get('.css-1nmdiq5-menu')
    .contains(employee + ', '+ memo + ' ('+ dateStr +')')
    .click();
  cy.get('#delete-memo-btn').click()
  cy.wait(1000)
  cy.get('#confirm-button').click()
}

export function Home(){
  cy.get('#Home').click()
}
