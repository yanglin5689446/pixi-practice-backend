


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
  }
  die(){
    this.die = true
    this.hp = 0
  }
}

module.exports = Tower