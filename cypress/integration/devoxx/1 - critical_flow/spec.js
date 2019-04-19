describe('Navigation', function() {
  it('should navigate through all the pages', function() {
    cy.log('Visit homepage')
    cy.visit("/")
    // TODO visit the / url
    cy.title().should('eq','Conduit')

    // TODO count the articles
    cy.get('.article-preview').should('have.length',10)

    // TODO check that tag list is present
    cy.get('.tag-list').should('exist')

    cy.log('Visit author page')

    cy.get(':nth-child(1) > .article-meta > .info > .author').click()
    // TODO check that author image is visible
    cy.get('.user-img').should('be.visible')

    // TODO check that h4 title is visible too
    cy.get('h4').should('be.visible') // plante s'il fait 0x0 par ex

    cy.log('Visit article page')
    // TODO come back to the home page

    cy.go('back')
    // TODO select the second article
    const secondArticleTitle = cy.get(':nth-child(2) > .preview-link > h1')
    secondArticleTitle.click()
    // TODO check that url contain 'article' keyword

    cy.url().should('contain','article')
    // TODO check that the banner exist
    cy.get('.banner').should('exist')
    // TODO check that the article content exist too
    cy.get('.article-content').should('exist')
    cy.log('Logging in')
    // TODO go to login page

    cy.visit('/login')
    // TODO enter the cypress@devoxx.fr email
    cy.get(':nth-child(1) > .form-control').type('cypress@devoxx.fr')

    // TODO enter the cypressdevoxx password
    cy.get(':nth-child(2) > .form-control').type('cypressdevoxx')
    // TODO check that the redirection to the home occurred
    cy.get('.btn').click()

    cy.url().should('equal',`${Cypress.config().baseUrl}/`)

  })
})
