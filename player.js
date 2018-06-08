
const { world_size } = require('./constants')

class Player {
  constructor(id, nickname, team){
    this.x = 100 || Math.floor(Math.random() * world.width)
    this.y = 100 || Math.floor(Math.random() * world.height)
    this.facing = 'down'
    this.score = 0
    this.hp = 100
    this.max_hp = 100
    this.speed = 0

    this.id = id
    this.nickname = nickname
    this.team = team
    
    this.movement = this.movement.bind(this)
  }
  movement(update){
    this.x = update.x
    this.y = update.y
    this.facing = update.facing
    this.speed = update.speed
    this.moved = update.moved
  }
}

module.exports = Player