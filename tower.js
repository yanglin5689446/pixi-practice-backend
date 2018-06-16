
class Tower {
  constructor(x, y, tier, team){
    this.tier = tier
    this.stats = {
      hp: 0,
      max_hp: 0,
      dead: false,
      x: x,
      y: y,
    }

    switch(tier){
      case 1:
        this.stats.max_hp = 3000
        break
      case 2:
        this.stats.max_hp = 1000
        break
    }
    this.stats.hp = this.stats.max_hp

    this.team = team
    this.die = this.die.bind(this)
    this.to_exp = this.to_exp.bind(this)
    this.drop_coins = this.drop_coins.bind(this)
  }
  drop_coins(){
    const coins = require('./game').state.objects.coins
    const n = Math.floor(Math.random() * 10) + 10
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