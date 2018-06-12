
const { world_size } = require('./constants')

class Player {
  constructor(id, nickname, team){
    this.facing = 'down'
    this.score = 0
    this.max_hp = 100
    this.speed = 0
    this.attack_damage = 5

    this.id = id
    this.nickname = nickname
    this.team = team

    this.movement = this.movement.bind(this)
    this.die = this.die.bind(this)
    this.revive = this.revive.bind(this)
    this.revive()
  }
  movement(update){
    this.x = update.x
    this.y = update.y
    this.facing = update.facing
    this.speed = update.speed
    this.moved = update.moved
  }
  revive(){
    this.dead = false
    this.hp = this.max_hp

    const game = require('./game')
    switch(this.team){
        case 1:
            this.x = game.state.objects.towers[0].x
            this.y = game.state.objects.towers[0].y + 10
            break
        case 2:
            this.x = game.state.objects.towers[3].x
            this.y = game.state.objects.towers[3].y + 10
            break
        default:
            this.x = -1000
            this.y = -1000
    }
  }
  die(){
    this.dead = true
    this.hp = 0
    setTimeout(this.revive, 10000)
  }
}

module.exports = Player