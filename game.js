
const Player = require('./player')
const { world_size } = require('./constants')


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
        towers: {
          fox: [
            { x: tower_margin, y: world_size.height/2, max_hp: 10000, hp: 10000, tier: 1}, 
            { x: tower_margin, y: world_size.height/4, max_hp: 10000, hp: 10000, tier: 2}, 
            { x: tower_margin, y: world_size.height*3/4, max_hp: 10000, hp: 10000, tier: 2}, 
          ],
          panda: [
            { x: world_size.width - tower_margin, y: world_size.height/2, max_hp: 10000, hp: 10000, tier: 1}, 
            { x: world_size.width - tower_margin, y: world_size.height/4, max_hp: 10000, hp: 10000, tier: 2}, 
            { x: world_size.width - tower_margin, y: world_size.height*3/4, max_hp: 10000, hp: 10000, tier: 2},
          ],
        }
      }
    }
    this.updates = {
      players: this.state.players,
      disconnected: this.state.disconnected,
      objects: {
        towers: this.state.objects.towers
      }
    } 
  }
  add_player(id, data){
    this.state.players[id] = new Player(id, data.nickname, data.team)
  }
  handle_event(event){
    switch(event.type){
      case 'player_movement':
        this.state.players[event.payload.id].movement(event.payload)
        break
      case 'attack':
        this.state.players[event.payload.attacker]
        break
    }
  }
}

let game = new Game()

module.exports = game