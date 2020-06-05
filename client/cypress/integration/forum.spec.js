const time = Math.floor(new Date().getTime() / 10000)
const testUser = { email: `${time}@test.com`, password: 'awoo1234' }

Cypress.Cookies.defaults({
  whitelist: 'keystone.sid'
})

describe('Forum Operations', () => {
  before(() => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'admin@admin.com', password: 'Awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
  })

  // beforeEach(() => {

  // })

  it('should show create forum button when logged in', () => {
    cy.visit('/')
    cy.get('.font-display').should('contain', 'Create Forum')
  })

  it('should render create forum page', () => {
    cy.get('.font-display').click()
    cy.get('.text-3xl').should('contain', 'Create your community!')
  })

  it('shouldnt allow us to use an existing forum name', () => {
    cy.visit('/create')
    cy.get('input[name=name]').type('taken').wait(500).type('{enter}')
    cy.get('.text-red-600').should('contain', 'forum with this name already exists')
  })

  it('should require a forum name', () => {
    cy.visit('/create')
    cy.get('textarea').type('hello')
    cy.get('input[type=submit]').click()
    cy.get('.text-red-600').should('contain', 'need to enter a forum name')
  })

  it('should allow user to create forum and set a color', () => {
    cy.visit('/create')
    cy.get('input[name=name]').type(time)
    cy.get('textarea').type('hello')
    cy.get('input[value="orange"]').click()
    cy.get('input[type=submit]').click()

    cy.url().should('be', `/f/${time}`)
    cy.get(':nth-child(1) > .font-bold').should('contain', `${time}`)
    cy.get('.my-4 > div').should('contain', 'hello')
    cy.get(':nth-child(1) > .justify-end > .p-2').should('have.class', 'bg-orange-400')
  })

  it('should let user edit forum', () => {
    cy.visit(`/f/${time}`)
    cy.get('.space-y-2 > :nth-child(1)').click()
    cy.get('textarea').clear().type('goodbye')
    cy.get('input[value="purple"]').click()
    cy.get('input[type=submit]').click().wait(500)
    cy.get('.text-base > .flex > .font-bold').click()
    cy.url().should('be', `/f/${time}`)
    cy.get(':nth-child(1) > .font-bold').should('contain', `${time}`)
    cy.get('.my-4 > div').should('contain', 'goodbye')
    cy.get(':nth-child(1) > .justify-end > .p-2').should('have.class', 'bg-purple-400')
  })

  it('should let user subscribe', () => {
    cy.visit('/f/test')
    cy.get('.space-y-2 > :nth-child(2)').should('be', 'Subscribe')
    cy.get('.space-y-2 > :nth-child(2)').click()
    cy.get('.space-y-2 > :nth-child(2)').should('be', 'Subscribed!')
    cy.visit('/')
    cy.get('.mb-8 > .grid > .max-w-sm > .h-full > .justify-between > .flex > .text-gray-800').should('be', 'test')
  })

  it('should let user unsubscribe', () => {
    cy.visit('/f/test')
    cy.get('.space-y-2 > :nth-child(2)').should('be', 'Subscribed!')
    cy.get('.space-y-2 > :nth-child(2)').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Unsubscribed!')
    cy.get('.space-y-2 > :nth-child(2)').should('be', 'Subscribe')
  })
})
