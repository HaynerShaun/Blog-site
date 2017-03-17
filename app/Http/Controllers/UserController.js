'use strict'

const User = use('App/Model/User')
const Validator = use('Validator')
const Database = use('Database')

/*
    The UserController class handles user functions such as viewing, editing, and deleting profiles
*/

class UserController {

    /*
        profile routes the current user to their profile page
    */
    * profile (request, response) { 
        yield response.sendView('user/profile') 
    }

    /*
        edit allows the current user to make changes to their profile information
    */
    * edit (request, response) { 
        yield response.sendView('user/edit') 
    }

    /*
        updateProfile submits any profile changes to the database
    */
    * updateProfile (request, response) {
        const email = request.input('email')
        const display_name = request.input('display_name')
        const first_name = request.input('first_name')
        const last_name = request.input('last_name')

        const affectedRows = yield Database
            .table('users')
            .where({ id: request.currentUser.id })
            .update({ email: email, 
                    display_name: display_name, 
                    first_name: first_name, 
                    last_name: last_name 
                })

        yield request.session.put({ email: email })
        yield request.session.put({ display_name: display_name })
        yield request.session.put({ first_name: first_name })
        yield request.session.put({ last_name: last_name })

        return response.redirect('/user/profile')
    }

    /*
        delete allows the current user to delete their account
    */
    * delete (request, response) { 

        const affectedRows = yield Database
            .table('users')
            .where({ email: request.currentUser.email })
            .delete()

        yield request.auth.logout()
        return response.redirect('/')
    }

    /*
        user allows the current user to view all the posts that a specific user has posted. 
    */
    * user(request, response) {
        const display_name = request.param('display_name');
        const user = yield Database
            .select('id')
            .from('users')
            .where({ display_name: display_name })
        const posts = yield Database
            .from('posts')
            .where({ user_id: user[0].id })

        posts.display_name = display_name;

        yield response.sendView('user/user', { posts })
    }
}

module.exports = UserController
