


class Tower {
  constructor(x, y, tier, team){
    this.tier = tier
    switch(tier){
      case 1:
        this.max_hp = 3000
        break
      case 2:
        this.max_hp = 1000
        break
    }
    this.hp = this.max_hp
    this.x = x
    this.y = y
    this.team = team
    this.die = this.die.bind(this)
    this.to_exp = this.to_exp.bind(this)
  }
  die(){
    this.dead = true
    this.hp = 0
  }
  to_exp(){
    return 5000 / this.tier
  }
}

module.exports = Tower