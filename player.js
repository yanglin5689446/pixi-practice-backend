
const { updates, game, world } = require('./constants')

class Player {
  constructor(id, nickname){
    this.x = 100 || Math.floor(Math.random() * world.width)
    this.y = 100 || Math.floor(Math.random() * world.height)
    this.facing = 'down'
    this.score = 0
    this.hp = 100
    this.max_hp = 100
    this.speed = 0

    this.id = id
    this.nickname = nickname
    
    this.handle_event = this.handle_event.bind(this)
  }
  handle_event(event){
    switch(event.type){
      case 'update_position':
        this.x = event.payload.x
        this.y = event.payload.y
        this.facing = event.payload.facing
        this.speed = event.payload.speed
        this.moved = event.payload.moved
        break
      case 'eat_particle':
        if(game.objects.particles[event.payload.index]){
          game.objects.particles[event.payload.index] = null
          this.score += 1
        }
        break
    }
  }
}

module.exports = Player