describe('Search Operations', () => {
  it('should find the pagination forum', () => {
    cy.visit('/')
    cy.get('input[name=searchQuery]').type('paginationforum{enter}')
    cy.get('.container > .font-medium').should('contain', 'paginationforum')
    cy.get('.justify-between > .flex > .text-gray-800').should('contain', 'paginationforum')
    cy.get('.mb-1 > .flex > .font-bold').should('contain', '4')
  })

  it('should find thread called secondpage', () => {
    cy.visit('/')
    cy.get('input[name=searchQuery]').type('secondpage{enter}')
    cy.get('.max-w-6xl').should('exist')
    cy.get('.justify-between > .font-semibold').should('contain', 'secondpage')
    cy.get('.justify-end').should('contain', '@admin')
    cy.get('.mt-2 > .flex > .font-bold').should('contain', 'paginationforum')
  })

  it('should find thread called usertester', () => {
    cy.visit('/')
    cy.get('input[name=searchQuery]').type('usertester{enter}')
  })
})
