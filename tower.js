
const Mob = require('./mob')

class Tower {
  constructor(x, y, tier, team, id){
    this.tier = tier
    this.id = id
    this.stats = {
      hp: 0,
      max_hp: 0,
      dead: false,
      x: x,
      y: y,
    }

    switch(tier){
      case 1:
        this.stats.max_hp = 10000
        this.wave_interval = 90000
        break
      case 2:
        this.stats.max_hp = 5000
        this.wave_interval = 60000
        break
    }
    this.stats.hp = this.stats.max_hp
    this.next_wave_timestamp = Date.now()

    this.team = team
    this.die = this.die.bind(this)
    this.to_exp = this.to_exp.bind(this)
    this.drop_coins = this.drop_coins.bind(this)
  
  }
  generate_mobs(shift){
    let amount
    switch(this.tier){
      case 1:
        amount = 3
        break
      case 2:
        amount = 2
        break
    }
    const game = require('./game')
    const keys = Object.keys(game.state.players)
    let another_team = (this.team === 1 ? 2 : 1)
    const another_team_count = keys.filter(key => game.state.players[key].team == another_team)
    amount *= Math.ceil(another_team_count / 3) + 1

    const current_time = Date.now()
    const distance = 300
    for(let i = 0 ;i < amount; i ++){
      const hash_id = current_time + i + shift
      const x = this.stats.x + distance * Math.random(), y = this.stats.y + distance * Math.random()
      game.state.objects.mobs.data[hash_id] = new Mob(this.team, hash_id, x, y)
    }
    this.next_wave_timestamp = current_time + this.wave_interval

  }
  drop_coins(){
    const coins = require('./game').state.objects.coins
    const n = Math.floor(Math.random() * 5) + 5
    const displacement = 200
    const reward = 2000 / this.tier
    for(let i = 0 ;i < n ;i ++)
        coins.data[Date.now() + i] = { 
            x: this.stats.x + (2 * Math.random() - 1) * displacement, 
            y: this.stats.y + (2 * Math.random() - 1) * displacement,  
            value:  Math.floor(reward * Math.random())
        }
  }
  die(){
    this.stats.dead = true
    this.stats.hp = 0
    this.drop_coins()
  }
  to_exp(){
    return 5000 / this.tier
  }
}

module.exports = Tower