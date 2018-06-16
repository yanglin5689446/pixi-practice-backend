
const { world_size } = require('./constants')
const { distance_between } = require('./utilities')


class Mob {
  constructor(team, id, x, y){
    this.stats = {
      max_hp: 30,
      hp: 30,
      speed: 5,
      attack_damage: 8,
      reachable_range: 200,
      attack_available_timestamp: Date.now(),
      cd: 4000,
      exp: 100,
      x: x,
      y: y,
    }
    this.nickname = 'mob'
    this.team = team
    this.id = id
    this.moved = true

    this.action = this.action.bind(this)
    this.movement = this.movement.bind(this)
    this.check_boundary = this.check_boundary.bind(this)
    this.die = this.die.bind(this)
    this.to_exp = this.to_exp.bind(this)
    this.attack = this.attack.bind(this)
    this.drop_coins = this.drop_coins.bind(this)
    this.gain_exp = this.gain_exp.bind(this)

  }
  gain_exp(exp){
    this.stats.exp += exp
  }
  get is_cooldown(){
    return this.stats.attack_available_timestamp >= Date.now()
  }
  cooldown(){
    this.stats.attack_available_timestamp = Date.now() + this.stats.cd
  }
  to_exp(){
    return this.stats.exp
  }
  check_boundary(){
    if(this.stats.x < 0) this.stats.x = 0
    if(this.stats.y < 0) this.stats.y = 0
    if(this.stats.x > world_size.width) this.stats.x = world_size.width
    if(this.stats.y > world_size.height - 50) this.stats.y = world_size.height - 50
  }
  drop_coins(){
    const coins = require('./game').state.objects.coins
    const n = Math.floor(Math.random() * 3) + 1
    const displacement = 100
    const reward = 50
    for(let i = 0 ;i < n ;i ++)
        coins.data[Date.now() + i] = { 
            x: this.stats.x + (2 * Math.random() - 1) * displacement, 
            y: this.stats.y + (2 * Math.random() - 1) * displacement,  
            value: Math.floor(reward * Math.random())
        }
  }
  movement(update){
    if(this.stats.dead)return;

    this.stats.facing = update.facing
    this.moved = update.moved
    if(this.moved){
      if(this.stats.facing === 'up')this.stats.y -= this.stats.speed
      else if(this.stats.facing === 'down')this.stats.y += this.stats.speed
      else if(this.stats.facing === 'left')this.stats.x -= this.stats.speed
      else if(this.stats.facing === 'right')this.stats.x += this.stats.speed
    }

    this.check_boundary()

  }
  attack(event_target){
    let target 
    const game = require('./game')
    switch(event_target.type){
        case 'tower':
          target = game.state.objects.towers[event_target.id]
          break
        case 'player':
          target = game.state.players[event_target.id]
          break
    }
    if(!this.is_cooldown && this.team !== target.team && distance_between(this, target) <= this.stats.reachable_range  && !target.stats.dead){
        target.stats.hp -= this.stats.attack_damage
        this.cooldown()

        if(target.stats.hp <= 0) {
            target.die()
            this.gain_exp(target.to_exp())
        }

        game.updates.attacks.push({ target: event_target, type: 'normal_attack'})
    }
  }
  action(){
    let start
    let target

    switch(this.team){
      case 1:
        start = 5
        break
      case 2:
        start = 0
        break
    }

    let min_distance = 1e9
    const game = require('./game')
    game.state.objects.towers
      .slice(start, start + 5)
      .forEach(tower => {
        let distance = distance_between(this, tower) 
        if(distance < min_distance && !tower.stats.dead){
          min_distance = distance 
          target = tower
        }
      })
    const error = 30
    if(min_distance > this.stats.reachable_range){
      let dx = Math.abs(target.stats.x - this.stats.x)
      let dy = Math.abs(target.stats.y - this.stats.y)
      if(dx >= error){
        if(target.stats.x > this.stats.x)
          this.movement(({ facing: 'right', moved: true }))
        else if(target.stats.x < this.stats.x)
          this.movement(({ facing: 'left', moved: true }))
      }
      else if(dy >= error){
        if(target.stats.y > this.stats.y)
          this.movement(({ facing: 'down', moved: true }))
        else if(target.stats.y < this.stats.y)
          this.movement(({ facing: 'up', moved: true }))        
      }
    }
    else {
      this.movement(({ facing: this.stats.facing, moved: false }))        
      this.attack({ type: 'tower', id: target.id })
    }
  }

  die(){
    this.stats.dead = true
    this.stats.hp = 0
    this.drop_coins()
    const game = require('./game')
    game.state.objects.mobs.removed.push(this.id)
    delete game.state.objects.mobs.data[this.id]
  }
}

module.exports = Mob