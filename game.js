
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
    this.state = {  
      players: {},
      disconnected: [],
      objects: {
        towers: {
          fox: {
            main: { hp: 10000, max_hp: 10000 },
            top: { hp: 10000, max_hp: 10000 },
            bottom: { hp: 10000, max_hp: 10000 }
          },
          panda: {
            main: { hp: 10000, max_hp: 10000 },
            top: { hp: 10000, max_hp: 10000 },
            bottom: { hp: 10000, max_hp: 10000 }

          },
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
    }
  }
}

module.exports = Game