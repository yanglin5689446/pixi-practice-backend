
const { updates, game, world } = require('./constants')

class Player {
  constructor(id, nickname){
    this.x = Math.random() * world.height
    this.y = Math.random() * world.width
    this.rotation = 0
    this.score = 0
    this.hp = 100
    this.max_hp = 100

    this.id = id
    this.nickname = nickname
    
    this.handle_event = this.handle_event.bind(this)
  }
  handle_event(event){
    switch(event.type){
      case 'update_position':
        this.x += event.payload.x
        this.y += event.payload.y
        this.rotation = event.payload.rotation
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