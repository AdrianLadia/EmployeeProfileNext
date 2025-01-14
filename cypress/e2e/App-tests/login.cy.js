import ServerRequests from '../../../src/app/api/ServerRequests'
import {
  CreateEmployee,
  UpdateEmployee,
  // DeleteEmployee,
  CreateOffense,
  UpdateOffense,
  DeleteOffense,
  CreateMemo,
  SubmitMemo,
  DeleteMemo,
  clearCollections,
  Home
} from './testCommands.cy'

let serverRequests ;
serverRequests = new ServerRequests(false);


describe('Employee spec', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(6000)
  });

  context('EmployeeProfileNextApp', () => {
    it('Run tests', async () => {
      // Clear collections
      clearCollections(serverRequests)
      //Employee
      CreateEmployee(
        'John Doe',
        // '1234 Main St, New York, NY 10030',
        // '1234567890',
        // 'mhm.png',
        // 'minor.png',
        // 'smiley.png',
        // 'johndoe@gmail.com',
        // '2024-10-31',
        // 'Google',
        // '100'
      )
      UpdateEmployee({
        employee :'John Doe',
        name : 'John Doe Letigio',
        company : 'OpenAi Inc.',
      })

      // Offense
      CreateOffense(
        "Employee was late to work",
        ['Dismissal'],
      )

      UpdateOffense({
        offense: "Employee was late to work",
        number: '2',
        title: " multiple times",
        description: " multiple times",
        offenseType: ["Written-Reprimand"],
      })

      // Memo
      CreateMemo(
        "John Doe Letigio",
        "Employee was late to work multiple times",
        "late again bro",
        "ayaw na ka late pls",
        // null,
        "mhm.png",
        "minor.png",
      )

      // Delete memo
      DeleteMemo({
        employee: "John Doe Letigio",
        memo: "Employee was late to work multiple times",
      })

      // create another memo with different data
      CreateMemo(
        "John Doe Letigio",
        "Employee was late to work multiple times",
        "Employee was late to work nasad",
        "ayaw na ka late pls",
        // "wala lang hehe",
        "mhm.png",
        "minor.png",
      )

      // Submit memo
      SubmitMemo({
        employee: "John Doe Letigio",
        memo: "Employee was late to work multiple times",
      })

      // Delete Employee
      // DeleteEmployee(
      //   "John Doe Letigio"
      // )

      // Delete Offense
      DeleteOffense('Employee was late to work multiple times')
      Home()
    })
  })
})
