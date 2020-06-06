const time = Math.floor(new Date().getTime() / 10000)

Cypress.Cookies.defaults({
  whitelist: 'keystone.sid'
})

describe('Post Operations', () => {
  before(() => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'admin@admin.com', password: 'Awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
  })

  it('should create a thread to work with', () => {
    cy.visit('/f/test')
    cy.get(':nth-child(1) > .justify-end > .p-2').click()
    cy.get('input[name=title]').type(`posttest ${time}`)
    cy.get('.resize-none').type('first post')
    cy.get('input[type=submit]').click()

    cy.url().should('be', `/f/test/posttest-${time}`)
  })

  it('should allow editing post', () => {
    cy.visit(`/f/test/posttest-${time}`)
    cy.get('.ml-2 > .px-2').click()
    cy.get('#edit > .w-full').clear().type('edited!')
    cy.get('.h-full > .flex-col > .px-2').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Post edited!')
  })

  it('should allow you to reply to thread', () => {
    cy.visit(`/f/test/posttest-${time}`)
    cy.get('.mb-4 > .justify-end > .p-2').click()
    cy.get('textarea').type('heres a reply!')
    cy.get('.px-3 > .flex > .ml-4').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Post made!')
    cy.get('.max-w-full').should('contain', 'heres a reply!')
  })

  it('should let new posts bump threads to the top', () => {
    cy.visit('/f/test')
    cy.get(':nth-child(1) > .font-semibold').should('be', `posttest ${time}`)
    cy.visit('/f/test/bumper')
    cy.get('.mb-4 > .justify-end > .p-2').click()
    cy.get('textarea').type('bump!')
    cy.get('.px-3 > .flex > .ml-4').click()
    cy.visit('/f/test')
    cy.get(':nth-child(1) > .font-semibold').should('be', 'bumper')
  })
})
