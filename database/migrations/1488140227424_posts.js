'use strict'

const Schema = use('Schema')

class PostsTableSchema extends Schema {

  //  Create the posts table with specified rows
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users')
      table.string('title')
      table.text('content')
      table.timestamps()
    })
  }

  //  Allows the posts table to be dropped
  down () {
    this.drop('posts')
  }

}

module.exports = PostsTableSchema
