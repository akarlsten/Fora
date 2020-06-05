const time = Math.floor(new Date().getTime() / 10000)
const testUser = { email: `${time}@test.com`, password: 'awoo1234' }

Cypress.Cookies.defaults({
  whitelist: 'keystone.sid'
})

describe('Landing Page', () => {
  // before(() => {
  //   cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'CREATE_USER', variables: { data: { name: `${time}`, displayName: 'Tester', email: testUser.email, password: testUser.password } }, query: 'mutation CREATE_USER($data: UserCreateInput!) {\n  createUser(data: $data) {\n    id\n    __typename\n  }\n}\n' })
  // })

  // beforeEach(() => {

  // })

  it('sucessfully loads', () => {
    cy.visit('/')
    cy.get('h2').should('contain', 'Create your community and discuss the things you care about.')
  })
})

describe('Signup', () => {
  before(() => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'CREATE_USER', variables: { data: { name: 'taken', displayName: 'taken', email: 'taken@taken.com', password: testUser.password } }, query: 'mutation CREATE_USER($data: UserCreateInput!) {\n  createUser(data: $data) {\n    id\n    __typename\n  }\n}\n' })
  })

  it('shouldnt allow us to use an already taken username', () => {
    cy.visit('/signup')
    cy.get('input[name=nickname]').type('taken')
    cy.get('input[name=username]').type(`${time}@test.com`)
    cy.get('input[name=password]').type('awoo1234')
    cy.get('input[name=confirm]').type('awoo1234{enter}')
    cy.get('.px-3 > .text-sm').should('contain', 'Username already taken.')
  })

  it('shouldnt allow us to use an already taken email', () => {
    cy.visit('/signup')
    cy.get('input[name=nickname]').type(time)
    cy.get('input[name=username]').type('taken@taken.com')
    cy.get('input[name=password]').type('awoo1234')
    cy.get('input[name=confirm]').type('awoo1234{enter}')
    cy.get(':nth-child(4) > .text-sm').should('contain', 'Email already in use')
  })

  it('shouldnt allow us to use mismatching passwords', () => {
    cy.visit('/signup')
    cy.get('input[name=nickname]').type(time)
    cy.get('input[name=username]').type(`${time}@test.com`)
    cy.get('input[name=password]').type('awoo1234')
    cy.get('input[name=confirm]').type('awoo2234{enter}')
    cy.get(':nth-child(8) > .text-sm').should('contain', 'passwords do not match')
  })

  it('shouldnt allow us to use weak passwords', () => {
    cy.visit('/signup')
    cy.get('input[name=nickname]').type(time)
    cy.get('input[name=username]').type(`${time}@test.com`)
    cy.get('input[name=password]').type('password')
    cy.get('input[name=confirm]').type('password{enter}')
    cy.get(':nth-child(8) > .text-sm').should('contain', 'passwords do not match')
  })

  it('should let us sign up', () => {
    cy.visit('/signup')
    cy.get('input[name=nickname]').type(time)
    cy.get('input[name=username]').type(`${time}@test.com`)
    cy.get('input[name=password]').type('awoo1234')
    cy.get('input[name=confirm]').type('awoo1234{enter}')
    cy.url().should('be', '/signin')
  })
})

describe('Logging in', () => {
  it('should log us in', () => {
    const { email, password } = testUser

    Cypress.Cookies.debug(true)

    cy.visit('/signin')
    cy.get('input[name=email]').type(email)
    cy.get('input[name=password]').type(`${password}{enter}`)
    cy.get('#sidebar-open').click()
    cy.url().should('be', '/')
    cy.get('.space-y-2 > a.flex').should('contain', `@${time}`)
  })
})
