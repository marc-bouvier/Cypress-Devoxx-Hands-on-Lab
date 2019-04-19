describe('Article page', function () {
    context('In an anonymous context', function () {
        it('should display the article page', function () {
            // TODO intercept the XHR requests and stub responses to make test pass !
            // fixtures
            cy.server()
            // on peut utiliser la payload directement
            // cy.route('/api/articles/*',{
            //   "article": {
            //     "title": "Cypress is cool",
            //     "slug": "cypress-is-cool-oni8y2",
            //     "body": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            //     "createdAt": "2018-04-11T14:21:37.840Z",
            //     "updatedAt": "2018-04-11T14:22:05.891Z",
            //     "tagList": ["e2e", "testing", "JavaScript"],
            //     "description": "stuff",
            //     "author": {
            //       "username": "Brice",
            //       "bio": null,
            //       "image": "http://image.noelshack.com/fichiers/2017/21/1495963178-brice6.png",
            //       "following": false
            //     },
            //     "favorited": false,
            //     "favoritesCount": 2
            //   }
            // }).as('getArticle')

            // ou utiliser une fixture
            cy.route('/api/articles/cypress-is-cool-oni8y2', 'fixture:/article/cypress-is-cool.json').as('getArticle')
            cy.route('/api/articles/cypress-is-cool-oni8y2/comments', 'fixture:/comments/cypress-is-cool.json').as('getArticle')
            cy.visit('/article/cypress-is-cool-oni8y2')
            cy.get('h1').should('contain', 'Cypress is cool')
            cy.get('.author').should('contain', 'Brice')
            cy.get('.date').should('contain', 'Wed Apr 11 2018')
            cy.get('.article-content').should('contain', 'Lorem Ipsum')
            cy.get('.tag-list').should('contain', 'e2e')

            cy.get('.card').as('comments')
            cy.get('@comments').should('have.length', 2)
            cy.get('@comments')
                .first()
                .should('contain', 'You definitely right !')
            cy.get('@comments')
                .eq(1)
                .should('contain', 'JavaScript is cool too ! ❤️')
        })

        it('should display nothing when the article is not found', function () {
            // TODO intercept the XHR requests and simulate a 404 error and see how your site behaves
            cy.server()
            cy.route({
                method: "GET",
                url: "**/api/articles/unknown-oni8y2",
                status: 404,
                response:  {},
                delay: 4000
            })
            cy.visit('/article/unknown-oni8y2')
            cy.get('.navbar').should('exist')
        })

        it('should display nothing when server internal error', function () {

            // TODO intercept the XHR requests and simulate a 500 error and see how your site behaves
            cy.server()
            cy.route({
                method: "GET",
                url: "**/api/articles/internal-error-oni8y2",
                status: 500,
                response: {}
            }).as('internalError')
            cy.visit('/article/internal-error-oni8y2')
            cy.get('.navbar').should('exist')
        })

        it('should display after a long request', function () {
            // TODO intercept the XHR requests and play with the 'delay' parameter to simulate differents response time
            // Ensure your settings are taking into account with your the dev tools !
            cy.server()
            cy.route({
                method: "GET",
                url: "**/api/articles/article2-oni8y2",
                status: 200,
                response:  'fixture:/article/cypress-is-cool.json',
                delay: 4000
            })
            cy.visit('/article/article2-oni8y2')
            cy.get('h1').should('contain', 'Cypress is cool')
            cy.get('.author').should('contain', 'Brice')
            cy.get('.date').should('contain', 'Wed Apr 11 2018')
            cy.get('.article-content').should('contain', 'Lorem Ipsum')
            cy.get('.tag-list').should('contain', 'e2e')
        })
    })

    context.only('In an authenticated context', function () {
        beforeEach(function () {
            // TODO Login
            cy.login(Cypress.config().email,Cypress.config().password)
            // You can first try with the login page
            // But with a custom command, it will be faster !

            cy.server()
            cy.route('/api/articles/*', 'fixture:/article/cypress-is-cool.json').as(
                'getArticle',
            )
            cy.route('/sockjs-node/**', {})
            cy.visit('/article/cypress-is-cool-oni8y2')
        })

        it('should display the article page', function () {
            cy.route(
                '/api/articles/*/comments',
                'fixture:/comments/cypress-is-cool.json',
            ).as('getArticleComments')
            cy.get('h1').should('contain', 'Cypress is cool')
            cy.get('.author').should('contain', 'Brice')
            cy.get('.date').should('contain', 'Wed Apr 11 2018')
            cy.get('.article-content').should('contain', 'Lorem Ipsum')
            cy.get('.tag-list').should('contain', 'e2e')

            cy.get('.card').as('comments')
            cy.get('@comments').should('have.length', 3)
            cy.get('@comments')
                .first()
                .should('contain', 'Post Comment')
            cy.get('@comments')
                .eq(1)
                .should('contain', 'You definitely right !')
            cy.get('@comments')
                .eq(2)
                .should('contain', 'JavaScript is cool too ! ❤️')
        })

        it('should allow user to post a comment', function () {
            const comment = 'Where is the documentation ?'
            cy.route('/api/articles/*/comments', {comments: []})
            cy.route({
                method: 'POST',
                status: 201,
                url: '/api/articles/*/comments',
                response: {
                    comment: {
                        id: 36721,
                        createdAt: '2019-03-16T23:33:59.621Z',
                        updatedAt: '2019-03-16T23:33:59.621Z',
                        body: comment,
                        author: {
                            username: 'Devoxx',
                            bio: null,
                            image:
                                'https://static.productionready.io/images/smiley-cyrus.jpg',
                            following: false,
                        },
                    },
                },
            })
            cy.get('textarea').type(comment)
            cy.get('button[type=submit]').click()
            cy.get('.card').as('comments')
            cy.get('@comments').should('have.length', 2)
            cy.get('@comments')
                .first()
                .should('contain', 'Post Comment')
            cy.get('@comments')
                .eq(1)
                .should('contain', comment)
        })

        it('should allow user to delete his comment', function () {
            cy.route(
                '/api/articles/*/comments',
                'fixture:/comments/cypress-is-cool-delete.json',
            ).as('getArticleComments')
            cy.route({
                url: '/api/articles/*/comments/*',
                response: {},
                method: 'DELETE',
                status: 204,
            }).as('getArticleComments')
            cy.contains('TO DELETE').should('be.visible')
            cy.get('.ion-trash-a').click()
            cy.contains('TO DELETE').should('not.exist')
        })
    })
})
