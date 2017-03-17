'use strict'

const User = use('App/Model/User')
const Database = use('Database')
const Validator = use('Validator')
const Hash = use('Hash')

/*
    The AuthenticationController class handles new user creation as well as users login and logouts. 
*/

class AuthenticationController {
    
    /*
        index routes users to the login page when first visiting the webpage. 
    */
    * index (request, response) { 
        yield response.sendView('auth/login') 
    }

    /*
        login takes the user credentials and attempts to log them into the webpage 
            If the credentials are correct the user is logged into their profile
            If not, the user is routed back to the login page. 
    */
    * login(request, response) {
        const userData = request.only('email', 'password') 

        const rules = {
            email: 'required',
            password: 'required'
        }

        const validation = yield Validator.validate(userData, rules) 

        if (validation.fails()) {
            yield request
            .withOnly('email', 'password')
            .andWith({ errors: validation.messages() })
            .flash() 

            response.redirect('back')
            return
        }
        const loginError = 'Invalid Credentials'

        try {
            const authCheck = yield request.auth.attempt(userData.email, userData.password)
            if (authCheck) {
                const current = yield Database.from('users').where({ email: userData.email })
                yield request.session.put({ id: current.id })
                yield request.session.put({ email: current.email })
                yield request.session.put({ display_name: current.display_name })
                yield request.session.put({ first_name: current.first_name })
                yield request.session.put({ last_name: current.last_name })
                return response.redirect('/post/feed')
            }
        } catch (e) {
            yield request.with({errors: e.message}).flash()
            response.redirect('back')
        }
    }

    /*
        logout destroys the current session and routes the user back to the login page.  
    */
    * logout(request, response) {
        yield request.auth.logout()

        return response.redirect('/')
    }

    /*
        create creates a new account for the user
    */
    * create (request, response) {
        const userData = request.only('email', 'password', 'display_name', 'first_name', 'last_name')

        const rules = {
            email: 'required',
            password: 'required',
            display_name: 'required',
            first_name: 'required',
            last_name: 'required'
        }

        const validation = yield Validator.validate(userData, rules) 

        if (validation.fails()) {
            yield request
                .withOnly('email', 'password', 'display_name', 'first_name', 'last_name')
                .andWith({ errors: validation.messages() })
                .flash() 

            response.redirect('back')
            return
        }

        yield User.create(userData)
        response.redirect('/auth/login')
    }

    /*
        regist routes new users to the register page which allows them to create an account
    */
    * register (request, response) { 
        yield response.sendView('auth/register') 
    }
}

module.exports = AuthenticationController
