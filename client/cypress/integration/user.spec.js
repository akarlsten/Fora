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

  it('should display user details', () => {
    cy.visit('/u/usertester')
    cy.get(':nth-child(4) > .text-2xl').should('contain', 'subscriptions')
    cy.get('.h-full').should('contain', 'test')
    cy.get('.my-2 > .font-medium').should('contain', 'forumban thread')
    cy.get('[data-testid=pagination] > p').should('contain', 'Page 1 of 1')
  })

  it('should allow us to edit display name', () => {
    cy.visit('/u/usertester')
    cy.get('.justify-end > .p-2').click()
    cy.get('[name="displayName"]').clear().type('Edited name')
    cy.contains('Update Info').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated user!')
    cy.get('.mb-8 > .flex > .font-bold').should('contain', 'Edited name')
    cy.visit('/u/usertester/edit')
    cy.get('[name="displayName"]').clear().type('usertester')
    cy.contains('Update Info').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated user!')
  })

  it('should allow admin to edit username', () => {
    cy.visit('/u/usertester')
    cy.get('.justify-end > .p-2').click()
    cy.get('[name="name"]').clear().type('usertester2')
    cy.contains('Update Info').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated user!')

    cy.visit('/u/usertester2')
    cy.get('.items-center > .flex > .font-light').should('contain', 'usertester2')
    cy.get('.justify-end > .p-2').click()
    cy.get('[name="name"]').clear().type('usertester')
    cy.contains('Update Info').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated user!')
  })

  it('should allow admin to globally ban user', () => {
    cy.visit('/u/usertester/edit')
    cy.contains('Ban User').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated user!')
    cy.visit('/u/usertester')
    cy.contains('This account has been banned from the entire website').should('exist')
    cy.visit('/u/usertester/edit')
    cy.contains('Unban User').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated user!')
  })

  it('shouldnt let user change email to already taken', () => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGN_OUT_MUTATION', variables: {}, query: 'mutation SIGN_OUT_MUTATION {\n  unauthenticateUser {\n    success\n    __typename\n  }\n}\n' })
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'usertester@test.com', password: 'awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
    cy.visit('/u/usertester/edit')
    cy.get('input[name=email]').clear().type('admin@admin.com')
    cy.contains('Change Details').click()
    cy.get('fieldset > :nth-child(2) > .text-sm').should('contain', 'Email already in use!')
  })

  it('shouldnt let user change email if password is wrong', () => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGN_OUT_MUTATION', variables: {}, query: 'mutation SIGN_OUT_MUTATION {\n  unauthenticateUser {\n    success\n    __typename\n  }\n}\n' })
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'usertester@test.com', password: 'awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
    cy.visit('/u/usertester/edit')
    cy.get('input[name=email]').clear().type('usertester2@test.com')
    cy.get('input[name=old]').type('wrongpassword')
    cy.contains('Change Details').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'confirm your old password, make sure')
  })

  it('should let user change email if password is correct', () => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGN_OUT_MUTATION', variables: {}, query: 'mutation SIGN_OUT_MUTATION {\n  unauthenticateUser {\n    success\n    __typename\n  }\n}\n' })
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'usertester@test.com', password: 'awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
    cy.visit('/u/usertester/edit')
    cy.get('input[name=email]').clear().type('usertester2@test.com')
    cy.get('input[name=old]').type('awoo1234')
    cy.contains('Change Details').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated')
    cy.visit('/u/usertester/edit')
    cy.get('input[name=email]').clear().type('usertester@test.com')
    cy.get('input[name=old]').type('awoo1234')
    cy.contains('Change Details').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated')
  })

  it('shouldnt let user change password if new passwords dont match', () => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGN_OUT_MUTATION', variables: {}, query: 'mutation SIGN_OUT_MUTATION {\n  unauthenticateUser {\n    success\n    __typename\n  }\n}\n' })
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'usertester@test.com', password: 'awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
    cy.visit('/u/usertester/edit')
    cy.get('input[name=password]').type('awoo2346')
    cy.get('input[name=confirm]').type('awoo2345')
    cy.get('input[name=old]').type('awoo1234')
    cy.contains('Change Details').click()
    cy.get(':nth-child(6) > .text-sm').should('contain', 'The passwords do not match')
  })

  it('should let user change password', () => {
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGN_OUT_MUTATION', variables: {}, query: 'mutation SIGN_OUT_MUTATION {\n  unauthenticateUser {\n    success\n    __typename\n  }\n}\n' })
    cy.request('POST', 'https://fora-test-api.adamkarlsten.com', { operationName: 'SIGNIN_MUTATION', variables: { email: 'usertester@test.com', password: 'awoo1234' }, query: 'mutation SIGNIN_MUTATION($email: String!, $password: String!) {\n  authenticateUserWithPassword(email: $email, password: $password) {\n    item {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}\n' })
    cy.visit('/u/usertester/edit')
    cy.get('input[name=password]').type('awoo2345')
    cy.get('input[name=confirm]').type('awoo2345')
    cy.get('input[name=old]').type('awoo1234')
    cy.contains('Change Details').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated')
    cy.visit('/u/usertester/edit')
    cy.get('input[name=password]').type('awoo1234')
    cy.get('input[name=confirm]').type('awoo1234')
    cy.get('input[name=old]').type('awoo2345')
    cy.contains('Change Details').click()
    cy.get('.react-toast-notifications__toast__content').should('contain', 'Updated')
  })
})
