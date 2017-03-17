'use strict'

const Follower = use('App/Model/Follower')
const User = use('App/Model/User')
const Database = use('Database')

/*
    The FollowersController class handles all follower functions such as viewing users you are following 
    and which users are following you as well as following and unfollowing other users
*/

class FollowersController {
    /*
        newFollowers queries the database and returns all users that the current user is not following. 
    */
    * newFollowers (request, response) { 
        const followers = yield Database
            .select('user_id')
            .from('followers')
            .where({ follower_id: request.currentUser.id })

        var following = [];
        following.push(request.currentUser.id);

        for(var i = 0; i < followers.length; i++){
            following.push(followers[i].user_id);
        }

        const notFollowing = yield Database
            .from('users')
            .whereNotIn('id', following )   
            
        yield response.sendView('follower/newFollowers', { notFollowing }) 
    }
    
    /*
        followers queries the database and returns all users that are following the current user. 
    */
    * followers (request, response) { 
        const ids = yield Database
            .from('followers')
            .where({ user_id: request.currentUser.id })

        var follower_ids = [];

        for(var i = 0; i < ids.length; i++){
            follower_ids.push(ids[i].follower_id);
        }

        const all_followers = yield Database
            .from('users')
            .whereIn('id', follower_ids ) 
            
        yield response.sendView('follower/followers', { all_followers }) 
    }
    
    /*
        following queries the database and returns all users that the current user is following. 
    */
    * following (request, response) { 
        const users = yield Database
            .select('user_id')
            .from('followers')
            .where({ follower_id: request.currentUser.id })
        
        var followers = [];
        for(var i = 0; i < users.length; i++){
            followers.push(users[i].user_id);
        }
        
        const following = yield Database
            .from('users')
            .whereIn('id', followers )

        yield response.sendView('follower/following', { following }) 
    }
    
    /*
        follow adds a row to the database setting the current user as a follower of another user 
    */
    * follow (request, response) {
        const follower = new Follower()
        follower.user_id = request.param('id')
        follower.follower_id = request.currentUser.id
        yield follower.save() 
        response.redirect('/follower/newFollowers') 
    }
    
    /*
        unfollow removes a row from the database so the current user no longer follows a specified user
    */
    * unfollow (request, response) { 
        const affectedRows = yield Database
            .table('followers')
            .where({user_id: request.param('id'), follower_id:  request.currentUser.id })
            .delete()
        response.redirect('/follower/following') 
    }
}

module.exports = FollowersController
