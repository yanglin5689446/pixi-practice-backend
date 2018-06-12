
const Player = require('./player')
const Tower = require('./tower')

const { world_size } = require('./constants')

function attack(attack){
  let attacker = null, target = null
  switch(attack.attacker.type){
    case 'player':
      attacker = game.state.players[attack.attacker.id]
      break
  }
  switch(attack.target.type){
    case 'tower':
      target = game.state.objects.towers[attack.target.id]
      break
    case 'player':
      target = game.state.players[attack.target.id]
      break
  }
  target.hp -= attacker.attack_damage
  if(target.hp <= 0) target.die()

  game.updates.attacks.push(attack)
}

class Game {
  constructor(){
    this.start = this.start.bind(this)
    this.started = this.started.bind(this)
    this.add_player = this.add_player.bind(this)
    this.handle_event = this.handle_event.bind(this)
  }
  started(){
    return this._start
  }
  start(){
    this._start = true
    const tower_margin = 300
    this.state = {  
      players: {},
      disconnected: [],
      objects: {
        towers: [
          new Tower(tower_margin, world_size.height/2, 1, 1),
          new Tower(tower_margin, world_size.height/4, 2, 1),
          new Tower(tower_margin, world_size.height*3/4, 2, 1),
          new Tower(world_size.width - tower_margin, world_size.height/2, 1, 2),
          new Tower(world_size.width - tower_margin, world_size.height/4, 2, 2),
          new Tower(world_size.width - tower_margin, world_size.height*3/4, 2, 2),
        ]
      }
    }
    this.updates = {
      players: this.state.players,
      disconnected: this.state.disconnected,
      objects: {
        towers: this.state.objects.towers
      },
      attacks: []
    } 
  }
  add_player(id, data){
    this.state.players[id] = new Player(id, data.nickname, data.team)
  }
  handle_event(event){
    try{
      switch(event.type){
        case 'player_movement':
          this.state.players[event.payload.id].movement(event.payload)
          break
        case 'attack':
          attack(event.payload)
          break
      }
    }
    catch(err){
      console.log(err)
    }

  }
}

let game = new Game()

module.exports = game