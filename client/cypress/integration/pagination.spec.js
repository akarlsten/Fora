Cypress.Cookies.defaults({
  whitelist: 'keystone.sid'
})

describe('Pagination Tests', () => {
  before(() => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'admin@admin.com', password: 'Awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
  })

  it('should show that theres more than one page on forum', () => {
    cy.visit('/f/paginationforum')
    cy.get(':nth-child(1) > .font-semibold').should('contain', 'thread 4')
    cy.get('[data-testid=pagination] > :nth-child(3)').click()
    cy.get(':nth-child(1) > .font-semibold').should('contain', 'secondpage')
  })

  it('should show that theres more than one page on thread', () => {
    cy.visit('/f/paginationforum/thread-4')
    cy.get('.max-w-full').should('contain', 'asdsa')
    cy.get(':nth-child(3) > [data-testid=pagination] > :nth-child(3)').click()
    cy.get('.max-w-full').should('contain', 'secondpage')
  })
})
