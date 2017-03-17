'use strict'

const User = use('App/Model/User')
const Post = use('App/Model/Post')
const Validator = use('Validator')
const Database = use('Database')

/*
    The PostsController class handles all post functions such as creating, viewing, editing, and deleting posts. 
*/

class PostsController {

    /*
        feed queries the database and sends all the current users posts and the posts of any user 
        the current user is following to the feed view to be displayed
    */
    * feed (request, response) {
        const followers = yield Database
            .select('user_id')
            .from('followers')
            .where({ follower_id: request.currentUser.id })

        var users = [];
        users.push(request.currentUser.id);

        for(var i = 0; i < followers.length; i++){
            users.push(followers[i].user_id);
        }

        const posts = yield Database
            .select('posts.id', 'title', 'content', 'posts.created_at', 'email', 'display_name')
            .from('posts')
            .innerJoin('users', 'posts.user_id', 'users.id')
            .whereIn('user_id', users )
            
        yield response.sendView('post/feed', { posts }) 

    }

    /*
        new routes the user to the create post page
    */
    * new (request, response) {
        yield response.sendView('post/create')
    }

    /*
        create inserts a new post into the database for the current user
    */
    * create (request, response) {
        const postData = request.only('title', 'content') 

        const rules = {
            title: 'required',
            content: 'required'
        }

        const validation = yield Validator.validate(postData, rules) 

        if (validation.fails()) { yield request
            .withOnly('title', 'content')
            .andWith({ errors: validation.messages() })
            .flash() 

            response.redirect('back')
            return
        }
        postData.user_id = request.currentUser.id;
        yield Post.create(postData) 
        response.redirect('/post/feed')
    }

    /*
        editPost routes the user to the edit post page for a specific post
    */
    * editPost(request, response) {
        const post = yield Post.find(request.param('id'))
        yield response.sendView('post/edit', { post: post.toJSON() })
    }

    /*
        edit allows the current user to change the title or content of a post 
        that have already posted. 
    */
    * edit(request, response) {
        const id = request.input('id')
        const title = request.input('title')
        const content = request.input('content')

        const affectedRows = yield Database
            .table('posts')
            .where({ id: id })
            .update({ title: title, content: content })
        return response.redirect('/post/feed')
    }

    /*
        edit allows the current user to delete a post that they have already posted
    */
    * delete(request, response) {
        const affectedRows = yield Database
            .table('posts')
            .where({ id: request.param('id') })
            .delete()
        return response.redirect('/post/feed')
    }

    /*
        search queries the database for any post whose title or content contains
        the search parameter and send them to the search view to be displayed 
    */
    * search(request, response) {

        const searchData = request.only('search')

        const rules = {
            search: 'required'
        }

        const validation = yield Validator.validate(searchData, rules) 

        if (validation.fails()) {
            yield request
                .withOnly('search')
                .andWith({ errors: validation.messages() })
                .flash() 

            response.redirect('back')
            return
        }

        const searchTerm = searchData.search

        const posts = yield Database
            .from('posts')
            .innerJoin('users', 'posts.user_id', 'users.id')
            .where('content', 'like', `%${searchTerm}%`)
            .orWhere('title', 'like', `%${searchTerm}%`)
            
        yield response.sendView('post/search', { posts }) 
    }

    /*
        edit allows the current user to view a specific post
    */
    * post(request, response) {
        const post = yield Post.find(request.param('id'))
        yield response.sendView('post/post', { post: post.toJSON() })
    }
}

module.exports = PostsController
