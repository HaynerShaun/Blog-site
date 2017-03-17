'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

// Routes user to login page
Route.get('/', 'AuthenticationController.index')
// Routes user to register page
Route.get('auth/register', 'AuthenticationController.register')
// Routes user to logout
Route.get('logout', 'AuthenticationController.logout')

// Routes user to profile page
Route.get('user/profile', 'UserController.profile')
// Routes user to profile edit page
Route.get('user/edit', 'UserController.edit')
// Routes user to login page after deleting the account
Route.get('user/delete', 'UserController.delete')
// Routes user to user display page
Route.get('user/user/:display_name', 'UserController.user')

// Routes user to post feed page
Route.get('post/feed', 'PostsController.feed')
// Routes user to post creation page
Route.get('post/create', 'PostsController.new')
// Routes user to post delete page
Route.get('post/delete/:id', 'PostsController.delete')
// Routes user to post edit page
Route.get('post/edit/:id', 'PostsController.editPost')
// Routes user to post view page
Route.get('post/post/:id', 'PostsController.post')

// Routes user to follower page that displays users being followed
Route.get('follower/following', 'FollowersController.following')
// Routes user to follower page that displays users that are following current user
Route.get('follower/followers', 'FollowersController.followers')
// Routes user to follower page that displays users that aren't being followed
Route.get('follower/newFollowers', 'FollowersController.newFollowers')
// Follows user and routes back to newFollowers page
Route.get('follower/follow/:id', 'FollowersController.follow')
// Unfollows user and routes back to followers page
Route.get('follower/unfollow/:id', 'FollowersController.unfollow')

//Forms
// Grabs information from login form
Route.post('auth/login', 'AuthenticationController.login')
// Grabs information from register form
Route.post('auth/register', 'AuthenticationController.create')
// Grabs information from profile edit form
Route.post('user/edit', 'UserController.updateProfile')
// Grabs information from create post form
Route.post('post/create', 'PostsController.create')
// Grabs information from search form
Route.post('post/search', 'PostsController.search')
// Grabs information from search form
Route.post('post/PostsController.search', 'PostsController.search')
// Grabs information from post edit form
Route.post('post/edit', 'PostsController.edit')