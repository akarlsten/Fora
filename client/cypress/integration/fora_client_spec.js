const time = Math.floor(new Date().getTime() / 10000)
const testUser = { email: `${time}@test.com`, password: 'awoo1234' }

describe('Landing Page and Logging In', () => {
  Cypress.Cookies.defaults({
    whitelist: 'keystone.sid'
  })
  before(() => {
    cy.request('POST', 'http://localhost:3000', { operationName: 'CREATE_USER', variables: { data: { name: 'Tester', displayName: time, email: testUser.email, password: testUser.password } }, query: 'mutation CREATE_USER($data: UserCreateInput!) {\n  createUser(data: $data) {\n    id\n    __typename\n  }\n}\n' })
  })

  // beforeEach(() => {

  // })

  it('sucessfully loads', () => {
    cy.visit('/')
    cy.get('h2').should('contain', 'Create your community and discuss the things you care about.')
  })

  it('should log us in', () => {
    const { email, password } = testUser

    Cypress.Cookies.debug(true)

    cy.visit('/signin')
    cy.get('input[name=email]').type(email)
    cy.get('input[name=password]').type(`${password}{enter}`)
    cy.get('#sidebar-open').click()
    cy.url().should('be', '/')
    cy.get('.space-y-2 > a.flex').should('contain', '@tester')
  })
})
