'use strict'

const Schema = use('Schema')

class FollowersTableSchema extends Schema {

  //  Create the followers table with specified rows
  up () {
    this.create('followers', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users')
      table.integer('follower_id').references('id').inTable('users')
      table.unique(['user_id', 'follower_id']);
      table.timestamps()
    })
  }

  //  Allows the followers table to be dropped
  down () {
    this.drop('followers')
  }

}

module.exports = FollowersTableSchema
