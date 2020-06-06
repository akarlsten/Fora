const time = Math.floor(new Date().getTime() / 10000)

Cypress.Cookies.defaults({
  whitelist: 'keystone.sid'
})

describe('User Operations', () => {
  before(() => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'admin@admin.com', password: 'Awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
  })

  it('should allow mods/admins to ban and unban users from forums', () => {
    cy.visit('/f/test/forumban-thread')
    cy.contains('Ban').click()
    cy.get('.mr-1 > .h-4').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'banned!')
    cy.reload()
    cy.contains('BANNED!').should('exist')
    cy.contains('(forum)').should('exist')

    cy.visit('/f/test/a/edit')
    cy.get('.mt-20 > .w-full > :nth-child(1)').should('contain', 'usertester')
    cy.get('svg[height="14"]').click()
    cy.get(':nth-child(1) > .mt-2 > :nth-child(3)').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Successfully changed banned users!')
  })
})
