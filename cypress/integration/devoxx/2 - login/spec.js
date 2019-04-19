describe('Login page', function () {

    before(function () {
        // runs before all tests in this block
        cy.visit('/login')
    });

    it('should display nicely', function () {
        // TODO check the 'Sign in' label is visible
        cy.get('h1.text-xs-center').should('be.visible')
        cy.get('h1.text-xs-center').should('contain','Sign In')

        // TODO check the form is nicely displayed (email, password, submit button)
    })

    it('should display error message when empty email and password are submitted', function () {
        // TODO submit the form and ensure the error message is displayed
        submit();
        errorIsVisible();
    })

    it('should display error message when password is empty', function () {
        // TODO fill only the username field and submit the form => ensure the error message is displayed
        typeUsername('cypress@devoxx.fr');
        submit()
        errorIsVisible();
    })

    it('should display error message when email is empty', function () {
        typePassword("cypressdevoxx");
        submit()
        errorIsVisible();
        // TODO fill only the password field and submit the form => ensure the error message is displayed
    })

    it('should display error message when login failed', function () {
        // TODO fill the form with incorrect data => ensure the error message is displayed
        typeUsername('ratefsd');
        typePassword("fsdf");
        submit()
        errorIsVisible();
    })

    it('should redirect to homepage when logging is successful', function () {
        // TODO happy path : use cypress@devoxx.fr/cypressdevoxx to fill the form and ensure you are logged
        typeUsername('cypress@devoxx.fr');
        typePassword("cypressdevoxx");
        submit()
        errorIsVisible();
    })



    function typeUsername(username) {
        // clear car le browser a sauvé les credential et me log correctement s'il les connait
        cy.get(':nth-child(1) > .form-control').clear().type(username)
    }

    function submit() {
        cy.get('.btn').click()
    }

    function errorIsVisible() {
        cy.get('.error-messages').should('be.visible')
    }

    function typePassword(password) {

        cy.get(':nth-child(2) > .form-control').type(password)
    }
})
