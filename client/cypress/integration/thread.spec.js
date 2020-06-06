const time = Math.floor(new Date().getTime() / 10000)

Cypress.Cookies.defaults({
  whitelist: 'keystone.sid'
})

describe('Thread Operations', () => {
  before(() => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'admin@admin.com', password: 'Awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
  })

  it('should allow us to create a thread', () => {
    cy.visit('/f/test')
    cy.get(':nth-child(1) > .justify-end > .p-2').click()
    cy.get('input[name=title]').type(`thread ${time}`)
    cy.get('.resize-none').type('first post')
    cy.get('input[type=submit]').click()

    cy.url().should('be', `/f/test/thread-${time}`)
  })

  it('shouldnt allow us to create a thread with a too short title', () => {
    cy.visit('/f/test')
    cy.get(':nth-child(1) > .justify-end > .p-2').click()
    cy.get('input[name=title]').type('123')
    cy.get('.resize-none').type('first post')
    cy.get('input[type=submit]').click()

    cy.get('.px-3 > .text-sm').should('contain', 'must be between 4 and 75')
  })

  it('shouldnt allow us to create a thread with a too long title', () => {
    cy.visit('/f/test')
    cy.get(':nth-child(1) > .justify-end > .p-2').click()
    cy.get('input[name=title]').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sodales turpis.')
    cy.get('.resize-none').type('first post')
    cy.get('input[type=submit]').click()

    cy.get('.px-3 > .text-sm').should('contain', 'must be between 4 and 75')
  })

  it('shouldnt allow us to create a thread with no content', () => {
    cy.visit('/f/test')
    cy.get(':nth-child(1) > .justify-end > .p-2').click()
    cy.get('input[name=title]').type(`thread ${time}`)
    cy.get('input[type=submit]').click()

    cy.get(':nth-child(4) > .text-sm').should('contain', 'Content must be between 1 and 20000 characters.')
  })

  it('should allow us to sticky a thread', () => {
    cy.visit('/f/test')
    cy.get(':nth-child(1) > .justify-end > .p-2').click()
    cy.get('input[name=title]').type(`thread ${time} 2`)
    cy.get('.resize-none').type('first post')
    cy.get('input[type=submit]').click()
    cy.url().should('be', `/f/test/thread-${time}-2`)

    cy.get('.flex-wrap > .flex > :nth-child(1) > .cursor-pointer').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Thread stickied!')
  })

  it('should allow us to unsticky a thread', () => {
    cy.visit(`/f/test/thread-${time}-2`)

    cy.get('.flex-wrap > .flex > :nth-child(1) > .cursor-pointer').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Thread unstickied!')
  })

  it('should allow us to close a thread', () => {
    cy.visit(`/f/test/thread-${time}-2`)

    cy.contains('Close Thread').click()
    cy.get('.ml-8').should('contain', 'This thread is closed and cannot be posted in.')
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Thread closed!')
  })

  it('should allow us to open a thread', () => {
    cy.visit(`/f/test/thread-${time}-2`)

    cy.contains('Reopen Thread').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Thread opened!')
  })

  it('should allow us to edit a thread title', () => {
    cy.visit(`/f/test/thread-${time}-2`)

    cy.get('.flex-wrap > :nth-child(2) > .cursor-pointer').click()
    cy.get('input[name=title]').clear().type(`edited ${time}`)
    cy.get('.ml-4 > .cursor-pointer').click()

    cy.get('.react-toast-notifications__toast__content').should('contain', 'Thread edited!')
    cy.get('.text-4xl').should('be', `edited ${time}`)
  })
})
