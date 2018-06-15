
const { world_size } = require('./constants')

function calculate_exp(level){
    return Math.ceil(100 * Math.pow(1.4, level - 1))
}

class Player {
  constructor(id, nickname, team){
    this.facing = 'down'
    this.max_hp = 100
    this.speed = 20
    this.attack_damage = 5
    this.reachable_range = 200
    this.gold = 0
    this.level = 1
    this.exp = 0
    this.next_level_exp = calculate_exp(this.level)
    this.attack_available_timestamp = Date.now()



    this.id = id
    this.nickname = nickname
    this.team = team

    this.movement = this.movement.bind(this)
    this.check_boundary = this.check_boundary.bind(this)
    this.die = this.die.bind(this)
    this.revive = this.revive.bind(this)
    this.gain_exp = this.gain_exp.bind(this)
    this.to_exp = this.to_exp.bind(this)


    this.revive()
  }

  gain_exp(exp){
    this.exp += exp
    while(this.exp >= this.next_level_exp){
        this.level ++
        this.exp -= this.next_level_exp
        this.next_level_exp = calculate_exp(this.level)
    }
  }
  cooldown(){
    this.attack_available_timestamp = Date.now() + 2000
  }
  to_exp(){
    this.exp = 0
    return this.level * 10
  }
  check_boundary(){
    if(this.x < 0) this.x = 0
    if(this.y < 0) this.y = 0
    if(this.x > world_size.width) this.x = world_size.width
    if(this.y > world_size.height - 50) this.y = world_size.height - 50
  }
  movement(update){
    if(this.dead)return;

    this.facing = update.facing
    this.speed = update.speed
    this.moved = update.moved

    if(this.facing === 'up')this.y -= update.speed
    else if(this.facing === 'down')this.y += update.speed
    else if(this.facing === 'left')this.x -= update.speed
    else if(this.facing === 'right')this.x += update.speed

    this.check_boundary()

  }
  revive(){
    this.dead = false
    this.hp = this.max_hp
    const displacement = 100

    const game = require('./game')
    switch(this.team){
        case 1:
            this.x = game.state.objects.towers[0].x + (2 * Math.random() - 1) * displacement
            this.y = game.state.objects.towers[0].y + (2 * Math.random() - 1) * displacement
            break
        case 2:
            this.x = game.state.objects.towers[3].x + (2 * Math.random() - 1) * displacement
            this.y = game.state.objects.towers[3].y + (2 * Math.random() - 1) * displacement
            break
        default:
            this.x = -1000
            this.y = -1000
    }
  }
  die(){
    this.dead = true
    this.hp = 0
    const game = require('./game')
    game.state.items.coins.data[Date.now()] = { x: this.x, y:this.y, value: 1000 }
    setTimeout(this.revive, 10000)
  }
}

module.exports = Player