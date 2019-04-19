// 1. use cy.request to make a request https://docs.cypress.io/api/commands/request.html

Cypress.Commands.add('login', (email, password) => {
    // TODO make an authentication by using the API !
    // => make a post request to https://conduit.productionready.io/api/users/login
    // with a payload like : {user: {email: email, password: password}}

    cy.request({
        method: 'POST',
        url: 'https://conduit.productionready.io/api/users/login',
        body: {user: {email, password}},
        status: 200
    }).then(response => {

        const {token, username} = response.body.user
        window.localStorage.setItem('jwt', token)
        cy.log('Logged now with ' + username)
    })

    // 2. use the token in the response to authenticate yourself in the application
    // => just put the token value in the 'jwt' key in the local storage

})
/*

{"user":{"id":25933,"email":"cypress@devoxx.fr","createdAt":"2018-04-09T23:03:19.840Z","updatedAt":"2019-04-14T21:00:17.238Z","username":"Updated Profile","bio":null,"image":"","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU5MzMsInVzZXJuYW1lIjoiVXBkYXRlZCBQcm9maWxlIiwiZXhwIjoxNTYwODU4Nzk5fQ.mcirNcbU7pkyTI6Qk4D746HeVu71z53rKoL7ys-i_KU"}}*/
