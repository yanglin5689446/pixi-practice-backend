
const { world_size } = require('./constants')
const game = require('./game')

class Player {
  constructor(id, nickname, team){
    this.facing = 'down'
    this.score = 0
    this.hp = 100
    this.max_hp = 100
    this.speed = 0

    this.id = id
    this.nickname = nickname
    this.team = team
    const game = require('./game')
    switch(team){
        case 1:
            this.x = game.state.objects.towers.fox[0].x
            this.y = game.state.objects.towers.fox[0].y + 10
            break
        case 2:
            this.x = game.state.objects.towers.panda[0].x
            this.y = game.state.objects.towers.panda[0].y + 10
            break
        default:
            this.x = -1000
            this.y = -1000
    }

    
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